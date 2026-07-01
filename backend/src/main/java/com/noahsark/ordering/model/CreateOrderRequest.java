package com.noahsark.ordering.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CreateOrderRequest(@NotBlank String tableNo, String remark, @NotEmpty List<@Valid OrderItemRequest> items) {}
