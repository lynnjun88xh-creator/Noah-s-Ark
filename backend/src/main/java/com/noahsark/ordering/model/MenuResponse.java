package com.noahsark.ordering.model;

import java.util.List;

public record MenuResponse(List<MenuCategory> categories, List<Dish> dishes) {}
