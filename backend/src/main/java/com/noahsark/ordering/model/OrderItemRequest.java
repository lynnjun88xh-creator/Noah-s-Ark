package com.noahsark.ordering.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record OrderItemRequest(@NotNull Long dishId, String name, @NotNull BigDecimal price, @Min(1) int quantity) {}
