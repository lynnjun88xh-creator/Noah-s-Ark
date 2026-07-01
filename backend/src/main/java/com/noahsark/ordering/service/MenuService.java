package com.noahsark.ordering.service;

import com.noahsark.ordering.model.Dish;
import com.noahsark.ordering.model.MenuCategory;
import com.noahsark.ordering.model.MenuResponse;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MenuService {
    private final List<MenuCategory> categories = List.of(
        new MenuCategory(1L, "热销", 1),
        new MenuCategory(2L, "套餐", 2),
        new MenuCategory(3L, "饮品", 3)
    );

    private final List<Dish> dishes = List.of(
        new Dish(1L, 1L, "方舟招牌牛肉饭", "慢炖牛肉配温泉蛋", new BigDecimal("28.00"), 392, "/assets/beef-rice.png", true),
        new Dish(2L, 2L, "黑椒鸡腿套餐", "含米饭、例汤和小菜", new BigDecimal("32.00"), 268, "/assets/chicken-set.png", true),
        new Dish(3L, 1L, "鲜虾云吞面", "手工云吞搭配鲜虾汤底", new BigDecimal("26.00"), 187, "/assets/noodle.png", true),
        new Dish(4L, 3L, "柠檬气泡茶", "清爽解腻，少糖可选", new BigDecimal("12.00"), 516, "/assets/lemon-tea.png", true)
    );

    public MenuResponse getMenu() {
        return new MenuResponse(categories, dishes.stream().filter(Dish::available).toList());
    }
}
