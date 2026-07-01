package com.noahsark.ordering.model;

import java.math.BigDecimal;

public record Dish(Long id, Long categoryId, String name, String description, BigDecimal price, int monthlySales, String imageUrl, boolean available) {}
