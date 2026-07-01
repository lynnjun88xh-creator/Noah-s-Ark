package com.noahsark.ordering.service;

import com.noahsark.ordering.model.CreateOrderRequest;
import com.noahsark.ordering.model.OrderResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    private final AtomicInteger sequence = new AtomicInteger(1000);
    private final List<OrderResponse> orders = Collections.synchronizedList(new ArrayList<>());

    public OrderResponse create(CreateOrderRequest request) {
        BigDecimal total = request.items().stream()
            .map(item -> item.price().multiply(BigDecimal.valueOf(item.quantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        String orderNo = "NA" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + sequence.incrementAndGet();
        OrderResponse response = new OrderResponse(orderNo, request.tableNo(), "PENDING", "待接单", total, LocalDateTime.now(), request.items(), request.remark());
        orders.add(0, response);
        return response;
    }

    public List<OrderResponse> list() {
        return List.copyOf(orders);
    }
}
