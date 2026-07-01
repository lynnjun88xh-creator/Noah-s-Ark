package com.noahsark.ordering.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(String orderNo, String tableNo, String status, String statusText, BigDecimal totalAmount, LocalDateTime createdAt, List<OrderItemRequest> items, String remark) {}
