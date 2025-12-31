const db = require('./db');

const recipes = [
    {
        title: "Chicken Biryani",
        description: "Aromatic and flavorful chicken layered with spiced basmati rice.",
        cuisine: "Desi",
        category: "Main Course",
        cooking_time: "120m",
        servings: 4,
        image_url: "https://ministryofcurry.com/wp-content/uploads/2024/06/chicken-biryani.jpg",
        youtube_url: "https://youtu.be/6XlMguO9r-M?si=tYuTOs36oKx4cRQ_",
        ingredients_json: JSON.stringify([
            { name: "Basmati Rice", quantity: "2", unit: "cups" },
            { name: "Chicken", quantity: "1", unit: "kg" },
            { name: "Onion", quantity: "2", unit: "medium" },
            { name: "Garlic", quantity: "5", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Yogurt", quantity: "1", unit: "cup" },
            { name: "Biryani Masala", quantity: "2", unit: "tbsp" },
            { name: "Saffron", quantity: "0.5", unit: "tsp" },
            { name: "Ghee", quantity: "3", unit: "tbsp" },
            { name: "Mint", quantity: "1", unit: "bunch" },
            { name: "Coriander", quantity: "1", unit: "bunch" }
        ]),
        steps_json: JSON.stringify([
            "Wash and soak the basmati rice for at least 30 minutes to ensure fluffiness.",
            "Marinate the chicken with yogurt, ginger-garlic paste, and biryani masala for at least 1 hour to allow the flavors to penetrate.",
            "Fry thinly sliced onions in ghee until golden brown, then set aside half for garnishing and use the rest to prepare the masala.",
            "Add marinated chicken to the remaining onions and cook on medium heat until the chicken is partially cooked and the masala thickens.",
            "Parboil the soaked basmati rice with whole spices until it's about 70% cooked, then drain the water.",
            "Layer the partially cooked rice over the chicken masala, sprinkle saffron soaked in warm milk, mint, and coriander leaves on top.",
            "Cover tightly and cook on low heat (dum cooking) for 20-30 minutes to allow the flavors to meld.",
            "Gently mix before serving and garnish with the reserved fried onions."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 550, protein: 38, carbs: 60, fat: 18 })
    },
    {
        title: "Beef Nihari",
        description: "Slow-cooked, tender beef stew with rich spices.",
        cuisine: "Desi",
        category: "Main Course",
        cooking_time: "240m",
        servings: 6,
        image_url: "https://evakitchen.pk/wp-content/uploads/2017/10/nihari.jpg",
        youtube_url: "https://youtu.be/1Kd3mhopYaE?si=LMPEF1bmXPsRSKxI",
        ingredients_json: JSON.stringify([
            { name: "Beef Shank", quantity: "1", unit: "kg" },
            { name: "Ginger", quantity: "2", unit: "tbsp" },
            { name: "Garlic", quantity: "2", unit: "tbsp" },
            { name: "Onion", quantity: "1", unit: "large" },
            { name: "Nihari Masala", quantity: "1", unit: "pkt" },
            { name: "Wheat Flour", quantity: "0.5", unit: "cup" },
            { name: "Ghee", quantity: "0.5", unit: "cup" },
            { name: "Green Chilies", quantity: "4", unit: "pcs" },
            { name: "Coriander", quantity: "0.5", unit: "bunch" }
        ]),
        steps_json: JSON.stringify([
            "Heat ghee in a large pot and sauté sliced onions until golden brown.",
            "Add ginger-garlic paste and cook until aromatic.",
            "Add beef shank and sear all sides until slightly browned.",
            "Add nihari masala and water, cover, and slow-cook for 4 hours until beef is tender.",
            "Prepare a roux using wheat flour and water, then add to the stew to thicken the gravy.",
            "Cook on low heat for another 30 minutes to blend flavors.",
            "Garnish with green chilies and fresh coriander before serving."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 580, protein: 45, carbs: 20, fat: 36 })
    },
    {
        title: "Chicken Karahi",
        description: "Spicy and flavorful chicken cooked in a traditional karahi.",
        cuisine: "Desi",
        category: "Main Course",
        cooking_time: "60m",
        servings: 4,
        image_url: "https://feastingfood.com/wp-content/uploads/2024/10/Chicken-Karahi-1.jpg",
        youtube_url: "https://youtu.be/4PMmH2-5wJM?si=GOEDJEqcAAuhEn34",
        ingredients_json: JSON.stringify([
            { name: "Chicken", quantity: "1", unit: "kg" },
            { name: "Tomatoes", quantity: "4", unit: "medium" },
            { name: "Ginger", quantity: "1", unit: "tbsp" },
            { name: "Garlic", quantity: "1", unit: "tbsp" },
            { name: "Green Chilies", quantity: "5", unit: "pcs" },
            { name: "Karahi Masala", quantity: "2", unit: "tbsp" },
            { name: "Oil", quantity: "0.5", unit: "cup" },
            { name: "Coriander", quantity: "0.5", unit: "bunch" }
        ]),
        steps_json: JSON.stringify([
            "Heat oil in a karahi or wok and sauté ginger and garlic until aromatic.",
            "Add chicken pieces and cook until lightly browned.",
            "Add chopped tomatoes and karahi masala, cook until chicken is tender and gravy thickens.",
            "Add green chilies and fresh coriander, cook for 5 more minutes.",
            "Serve hot garnished with extra coriander."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 450, protein: 35, carbs: 12, fat: 28 })
    },
    {
        title: "Daal Tarka",
        description: "Flavorful lentils tempered with spices for a comforting dish.",
        cuisine: "Desi",
        category: "Main Course",
        cooking_time: "40m",
        servings: 4,
        image_url: "https://sandhyahariharan.co.uk/wp-content/uploads/2021/06/red-lentils-tarka-dal-1-1024x1536.jpg",
        youtube_url: "https://www.youtube.com/watch?v=40XtBW0tqms",
        ingredients_json: JSON.stringify([
            { name: "Red Lentils", quantity: "1", unit: "cup" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Green Chilies", quantity: "3", unit: "pcs" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Turmeric", quantity: "0.5", unit: "tsp" },
            { name: "Cumin Seeds", quantity: "1", unit: "tsp" },
            { name: "Ghee", quantity: "2", unit: "tbsp" },
            { name: "Coriander", quantity: "0.5", unit: "bunch" }
        ]),
        steps_json: JSON.stringify([
            "Rinse lentils and cook in water with turmeric until soft.",
            "Heat ghee in a pan and sauté cumin seeds, onions, garlic, and ginger.",
            "Add chopped tomatoes and green chilies, cook until tomatoes soften.",
            "Pour the tempered spices over cooked lentils and mix well.",
            "Simmer for 5 more minutes and garnish with fresh coriander."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 220, protein: 12, carbs: 35, fat: 6 })
    },
    {
        title: "Palak Paneer",
        description: "Soft paneer cubes in a creamy spinach gravy.",
        cuisine: "Desi",
        category: "Main Course",
        cooking_time: "35m",
        servings: 4,
        image_url: "https://www.cookwithmanali.com/wp-content/uploads/2019/08/Palak-Paneer.jpg",
        youtube_url: "https://www.youtube.com/watch?v=a5sr50WL1DY",
        ingredients_json: JSON.stringify([
            { name: "Spinach", quantity: "1", unit: "bunch" },
            { name: "Paneer", quantity: "250", unit: "g" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Green Chilies", quantity: "2", unit: "pcs" },
            { name: "Cream", quantity: "2", unit: "tbsp" },
            { name: "Ghee", quantity: "2", unit: "tbsp" },
            { name: "Cumin Seeds", quantity: "1", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Blanch spinach leaves and blend into a smooth puree.",
            "Heat ghee in a pan, add cumin seeds, onions, garlic, and ginger, sauté until golden.",
            "Add tomatoes and cook until soft, then add spinach puree.",
            "Simmer for 5-10 minutes, then add paneer cubes and cook for another 5 minutes.",
            "Finish with cream and garnish with a pinch of garam masala if desired."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 300, protein: 15, carbs: 12, fat: 20 })
    },
    {
        title: "Samosa",
        description: "Crispy pastry filled with spiced potatoes and peas.",
        cuisine: "Desi",
        category: "Snack",
        cooking_time: "50m",
        servings: 6,
        image_url: "https://c.ndtvimg.com/2023-03/0m65kep_samosa_625x300_10_March_23.jpg",
        youtube_url: "https://www.youtube.com/watch?v=gVQGYp__n4I",
        ingredients_json: JSON.stringify([
            { name: "All-purpose Flour", quantity: "2", unit: "cups" },
            { name: "Potatoes", quantity: "4", unit: "medium" },
            { name: "Peas", quantity: "0.5", unit: "cup" },
            { name: "Green Chilies", quantity: "2", unit: "pcs" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Spices", quantity: "1", unit: "tbsp" },
            { name: "Oil", quantity: "2", unit: "cups" },
            { name: "Coriander", quantity: "0.5", unit: "bunch" }
        ]),
        steps_json: JSON.stringify([
            "Prepare dough with flour, water, and a pinch of salt, then set aside.",
            "Boil and mash potatoes, mix with peas, chopped chilies, ginger, and spices.",
            "Roll out dough, cut into circles, and fill with potato mixture.",
            "Fold into triangle shapes and seal edges.",
            "Deep fry until golden brown and crispy."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 150, protein: 3, carbs: 20, fat: 7 })
    },
    {
        title: "Seekh Kabab",
        description: "Spiced minced meat skewers grilled to perfection.",
        cuisine: "Desi",
        category: "Snack",
        cooking_time: "45m",
        servings: 4,
        image_url: "https://c.ndtvimg.com/2020-01/a39okhfk_620_625x300_21_January_20.jpg",
        youtube_url: "https://www.youtube.com/watch?v=_1YMAoL5x7I",
        ingredients_json: JSON.stringify([
            { name: "Minced Meat", quantity: "500", unit: "g" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "1", unit: "tbsp" },
            { name: "Ginger", quantity: "1", unit: "tbsp" },
            { name: "Green Chilies", quantity: "3", unit: "pcs" },
            { name: "Garam Masala", quantity: "1", unit: "tsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "0.5", unit: "bunch" },
            { name: "Skewers", quantity: "6", unit: "pcs" }
        ]),
        steps_json: JSON.stringify([
            "Mix minced meat with chopped onions, garlic, ginger, green chilies, and spices.",
            "Shape mixture around skewers evenly.",
            "Grill or cook on a hot pan until meat is fully cooked and slightly charred.",
            "Serve hot with chutney or raita."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 320, protein: 25, carbs: 5, fat: 22 })
    },
    {
        title: "Chicken Shawarma",
        description: "Juicy marinated chicken wrapped in flatbread with sauces.",
        cuisine: "Middle Eastern",
        category: "Snack",
        cooking_time: "60m",
        servings: 4,
        image_url: "https://foxeslovelemons.com/wp-content/uploads/2023/06/Chicken-Shawarma-7-1022x1536.jpg",
        youtube_url: "https://m.youtube.com/watch?v=lrb_cJBPzLM&t=312s",
        ingredients_json: JSON.stringify([
            { name: "Chicken", quantity: "500", unit: "g" },
            { name: "Yogurt", quantity: "0.5", unit: "cup" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Paprika", quantity: "1", unit: "tsp" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "0.5", unit: "tsp" },
            { name: "Flatbread", quantity: "4", unit: "pcs" },
            { name: "Tahini Sauce", quantity: "0.25", unit: "cup" },
            { name: "Lettuce", quantity: "1", unit: "cup" },
            { name: "Tomatoes", quantity: "2", unit: "medium" }
        ]),
        steps_json: JSON.stringify([
            "Marinate chicken with yogurt, garlic, paprika, cumin, and coriander for at least 1 hour.",
            "Grill or pan-fry chicken until fully cooked and slightly charred.",
            "Warm flatbread and layer with lettuce, tomato, and sliced chicken.",
            "Drizzle with tahini or garlic sauce and roll tightly.",
            "Serve immediately with extra sauce on the side."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 400, protein: 35, carbs: 30, fat: 18 })
    },
    {
        title: "Falafel",
        description: "Crispy chickpea patties with herbs and spices.",
        cuisine: "Middle Eastern",
        category: "Snack",
        cooking_time: "40m",
        servings: 4,
        image_url: "https://s7300.pcdn.co/wp-content/uploads/2023/01/falafel-2.jpg",
        youtube_url: "https://www.youtube.com/watch?v=JRCV-niIGSI",
        ingredients_json: JSON.stringify([
            { name: "Chickpeas", quantity: "2", unit: "cups" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Parsley", quantity: "0.5", unit: "bunch" },
            { name: "Cumin", quantity: "1", unit: "tsp" },
            { name: "Coriander", quantity: "1", unit: "tsp" },
            { name: "Flour", quantity: "2", unit: "tbsp" },
            { name: "Baking Powder", quantity: "0.5", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "cups" }
        ]),
        steps_json: JSON.stringify([
            "Soak chickpeas overnight and drain.",
            "Blend chickpeas with onion, garlic, parsley, cumin, coriander, flour, and baking powder to form a coarse paste.",
            "Shape mixture into small balls or patties.",
            "Deep fry until golden brown and crispy.",
            "Serve with tahini sauce or yogurt dip."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 180, protein: 7, carbs: 20, fat: 9 })
    },
    {
        title: "Hummus",
        description: "Smooth and creamy chickpea dip flavored with tahini and garlic.",
        cuisine: "Middle Eastern",
        category: "Snack",
        cooking_time: "15m",
        servings: 4,
        image_url: "https://cdn.loveandlemons.com/wp-content/uploads/2024/08/hummus-recipe.jpg",
        youtube_url: "https://www.youtube.com/watch?v=PvYv3y7TYtI",
        ingredients_json: JSON.stringify([
            { name: "Chickpeas", quantity: "2", unit: "cups" },
            { name: "Tahini", quantity: "0.5", unit: "cup" },
            { name: "Garlic", quantity: "2", unit: "cloves" },
            { name: "Lemon Juice", quantity: "2", unit: "tbsp" },
            { name: "Olive Oil", quantity: "0.25", unit: "cup" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Paprika", quantity: "0.5", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Drain and rinse chickpeas.",
            "Blend chickpeas with tahini, garlic, lemon juice, and salt until smooth.",
            "Slowly add olive oil while blending to achieve creamy texture.",
            "Transfer to a serving dish and sprinkle paprika on top.",
            "Drizzle with extra olive oil and serve with pita bread or vegetables."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 170, protein: 6, carbs: 15, fat: 10 })
    },
    {
        title: "Chicken Mandi",
        description: "Aromatic spiced chicken served with fragrant basmati rice.",
        cuisine: "Middle Eastern",
        category: "Main Course",
        cooking_time: "120m",
        servings: 4,
        image_url: "https://www.munatycooking.com/wp-content/uploads/2022/09/Chicken-Mandi-1200-x1200-2022.jpg",
        youtube_url: "https://www.youtube.com/watch?v=XoIy4WhwdE4",
        ingredients_json: JSON.stringify([
            { name: "Chicken", quantity: "1", unit: "kg" },
            { name: "Basmati Rice", quantity: "2", unit: "cups" },
            { name: "Onion", quantity: "2", unit: "medium" },
            { name: "Garlic", quantity: "1", unit: "tbsp" },
            { name: "Ghee", quantity: "3", unit: "tbsp" },
            { name: "Mandi Spices", quantity: "2", unit: "tbsp" },
            { name: "Yogurt", quantity: "1", unit: "cup" },
            { name: "Coriander", quantity: "0.5", unit: "bunch" },
            { name: "Saffron", quantity: "0.5", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Marinate chicken with yogurt and mandi spices for at least 1 hour.",
            "Cook basmati rice with ghee, saffron, and spices until 70% done.",
            "Sauté onions and garlic in ghee, then add marinated chicken and cook until partially done.",
            "Layer partially cooked rice over chicken in a heavy-bottomed pot.",
            "Cover and cook on low heat for 30-40 minutes (dum style).",
            "Garnish with fried onions and fresh coriander before serving."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 520, protein: 38, carbs: 60, fat: 18 })
    },
    {
        title: "Kabsa Rice",
        description: "Fragrant spiced rice with tender chicken and a mix of traditional spices.",
        cuisine: "Middle Eastern",
        category: "Main Course",
        cooking_time: "100m",
        servings: 4,
        image_url: "https://butfirstchai.com/wp-content/uploads/2022/08/chicken-kabsa-rice-recipe-1152x1536.jpg",
        youtube_url: "https://www.youtube.com/watch?v=lrcUixJEPK0",
        ingredients_json: JSON.stringify([
            { name: "Chicken", quantity: "1", unit: "kg" },
            { name: "Basmati Rice", quantity: "2", unit: "cups" },
            { name: "Tomatoes", quantity: "3", unit: "medium" },
            { name: "Onion", quantity: "2", unit: "medium" },
            { name: "Garlic", quantity: "1", unit: "tbsp" },
            { name: "Kabsa Spices", quantity: "2", unit: "tbsp" },
            { name: "Ghee", quantity: "3", unit: "tbsp" },
            { name: "Coriander", quantity: "0.5", unit: "bunch" }
        ]),
        steps_json: JSON.stringify([
            "Marinate chicken with kabsa spices and set aside for 1 hour.",
            "Cook chopped onions, garlic, and tomatoes in ghee until soft.",
            "Add marinated chicken and cook until partially done.",
            "Parboil basmati rice and layer over the chicken.",
            "Cover tightly and cook on low heat for 25-30 minutes.",
            "Garnish with coriander and serve hot."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 510, protein: 36, carbs: 58, fat: 16 })
    },
    {
        title: "Fattoush Salad",
        description: "Fresh Middle Eastern salad with crispy bread, vegetables, and tangy dressing.",
        cuisine: "Middle Eastern",
        category: "Salad",
        cooking_time: "15m",
        servings: 4,
        image_url: "https://www.themediterraneandish.com/wp-content/uploads/2025/07/TMD-Fattoush-Edited-1-1024x1536.jpg",
        youtube_url: "https://www.youtube.com/watch?v=RuO6UuC1ogA",
        ingredients_json: JSON.stringify([
            { name: "Lettuce", quantity: "1", unit: "head" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Cucumber", quantity: "2", unit: "medium" },
            { name: "Radish", quantity: "2", unit: "pcs" },
            { name: "Green Chilies", quantity: "1", unit: "pc" },
            { name: "Parsley", quantity: "0.5", unit: "bunch" },
            { name: "Mint", quantity: "0.25", unit: "bunch" },
            { name: "Pita Bread", quantity: "2", unit: "pcs" },
            { name: "Olive Oil", quantity: "3", unit: "tbsp" },
            { name: "Lemon Juice", quantity: "2", unit: "tbsp" },
            { name: "Sumac", quantity: "1", unit: "tbsp" }
        ]),
        steps_json: JSON.stringify([
            "Toast pita bread until crispy and break into small pieces.",
            "Chop all vegetables and herbs and place in a large bowl.",
            "Add crispy pita pieces to the vegetables.",
            "Whisk olive oil, lemon juice, and sumac to make dressing.",
            "Pour dressing over salad, toss well, and serve fresh."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 180, protein: 4, carbs: 20, fat: 10 })
    },
    {
        title: "Burger",
        description: "Juicy beef patty sandwiched between soft buns with fresh toppings.",
        cuisine: "Western",
        category: "Snack",
        cooking_time: "30m",
        servings: 2,
        image_url: "https://www.andy-cooks.com/cdn/shop/articles/20240831035110-andy-20cooks-20-20juicy-20beef-20burger-20recipe.jpg?v=1725428158&width=1080",
        youtube_url: "https://www.youtube.com/watch?v=PQFxh-UDm9A",
        ingredients_json: JSON.stringify([
            { name: "Beef Patty", quantity: "2", unit: "pcs" },
            { name: "Burger Buns", quantity: "2", unit: "pcs" },
            { name: "Lettuce", quantity: "2", unit: "leaves" },
            { name: "Tomato", quantity: "2", unit: "slices" },
            { name: "Onion", quantity: "2", unit: "slices" },
            { name: "Cheese", quantity: "2", unit: "slices" },
            { name: "Ketchup", quantity: "2", unit: "tbsp" },
            { name: "Mayonnaise", quantity: "2", unit: "tbsp" }
        ]),
        steps_json: JSON.stringify([
            "Season beef patties with salt and pepper and cook on a grill or pan until desired doneness.",
            "Toast burger buns lightly.",
            "Assemble burger with lettuce, tomato, onion, cheese, and cooked patty.",
            "Add ketchup and mayonnaise as desired.",
            "Serve hot with fries or salad."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 550, protein: 30, carbs: 40, fat: 28 })
    },
    {
        title: "Club Sandwich",
        description: "Layered sandwich with chicken, bacon, lettuce, and tomato.",
        cuisine: "Western",
        category: "Snack",
        cooking_time: "20m",
        servings: 2,
        image_url: "https://f000.backblazeb2.com/file/recipekit-bucket/20240725081844-chicken-20bacon-20club-20sandwich-20main-20landscape.jpg",
        youtube_url: "https://www.youtube.com/watch?v=b6XexzWXid0",
        ingredients_json: JSON.stringify([
            { name: "Bread Slices", quantity: "3", unit: "pcs" },
            { name: "Chicken", quantity: "150", unit: "g" },
            { name: "Bacon", quantity: "2", unit: "strips" },
            { name: "Lettuce", quantity: "1", unit: "leaf" },
            { name: "Tomato", quantity: "2", unit: "slices" },
            { name: "Mayonnaise", quantity: "1", unit: "tbsp" },
            { name: "Cheese", quantity: "1", unit: "slice" }
        ]),
        steps_json: JSON.stringify([
            "Toast bread slices lightly.",
            "Cook chicken and bacon until fully done.",
            "Layer bread with chicken, bacon, lettuce, tomato, and cheese.",
            "Spread mayonnaise on each layer as desired.",
            "Cut sandwich into halves or quarters and serve."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 420, protein: 25, carbs: 35, fat: 20 })
    },
    {
        title: "Loaded Fries",
        description: "Crispy fries topped with cheese, jalapenos, and sauces.",
        cuisine: "Western",
        category: "Snack",
        cooking_time: "25m",
        servings: 2,
        image_url: "https://wildgameandfish.com/wp-content/uploads/2025/04/Loaded-Fries-with-Jalapeno-Ranch-1024x1024.jpg",
        youtube_url: "https://www.youtube.com/watch?v=rTMlWAhMgHk",
        ingredients_json: JSON.stringify([
            { name: "Potatoes", quantity: "3", unit: "large" },
            { name: "Cheddar Cheese", quantity: "0.5", unit: "cup" },
            { name: "Jalapenos", quantity: "2", unit: "pcs" },
            { name: "Bacon Bits", quantity: "2", unit: "tbsp" },
            { name: "Ranch Sauce", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Pepper", quantity: "0.5", unit: "tsp" },
            { name: "Oil", quantity: "2", unit: "cups" }
        ]),
        steps_json: JSON.stringify([
            "Cut potatoes into fries and deep fry until golden and crispy.",
            "Place fries on a serving plate and season with salt and pepper.",
            "Sprinkle grated cheddar cheese and bacon bits on top.",
            "Add sliced jalapenos and drizzle ranch sauce.",
            "Serve immediately while hot."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 400, protein: 10, carbs: 50, fat: 18 })
    },
    {
        title: "Chicken Wrap",
        description: "Soft flatbread rolled with spiced chicken and fresh vegetables.",
        cuisine: "Western",
        category: "Snack",
        cooking_time: "20m",
        servings: 2,
        image_url: "https://www.simplejoy.com/wp-content/uploads/2020/07/Chicken-wrap-1024x1536.jpg",
        youtube_url: "https://www.youtube.com/watch?v=UJi0fS1SxHg",
        ingredients_json: JSON.stringify([
            { name: "Chicken", quantity: "200", unit: "g" },
            { name: "Tortilla Wraps", quantity: "2", unit: "pcs" },
            { name: "Lettuce", quantity: "0.5", unit: "cup" },
            { name: "Tomato", quantity: "1", unit: "small" },
            { name: "Onion", quantity: "1", unit: "small" },
            { name: "Cheese", quantity: "0.25", unit: "cup" },
            { name: "Sauces", quantity: "2", unit: "tbsp" },
            { name: "Spices", quantity: "1", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Cook chicken with spices until fully cooked and juicy.",
            "Warm tortilla wraps on a pan.",
            "Layer wrap with lettuce, tomato, onion, cheese, and cooked chicken.",
            "Drizzle preferred sauces and roll tightly.",
            "Serve immediately."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 350, protein: 28, carbs: 30, fat: 15 })
    },
    {
        title: "Pizza Margherita",
        description: "Classic pizza with fresh tomatoes, mozzarella, and basil.",
        cuisine: "Italian",
        category: "Main Course",
        cooking_time: "35m",
        servings: 2,
        image_url: "https://ooni.com/cdn/shop/articles/20220211142347-margherita-9920_ba86be55-674e-4f35-8094-2067ab41a671.jpg?v=1737104576&width=2048",
        youtube_url: "https://www.youtube.com/watch?v=qQrZFAIc3XM",
        ingredients_json: JSON.stringify([
            { name: "Pizza Dough", quantity: "1", unit: "ball" },
            { name: "Tomato Sauce", quantity: "0.5", unit: "cup" },
            { name: "Mozzarella Cheese", quantity: "1", unit: "cup" },
            { name: "Fresh Basil", quantity: "5", unit: "leaves" },
            { name: "Olive Oil", quantity: "1", unit: "tbsp" },
            { name: "Salt", quantity: "0.5", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Preheat oven to 475°F (245°C).",
            "Roll out pizza dough on a floured surface.",
            "Spread tomato sauce evenly over the dough.",
            "Add mozzarella cheese and fresh basil leaves on top.",
            "Drizzle with olive oil and bake for 10-12 minutes until crust is golden and cheese melts.",
            "Slice and serve hot."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 400, protein: 18, carbs: 50, fat: 15 })
    },
    {
        title: "Garlic Bread",
        description: "Crispy bread slices with buttery garlic flavor.",
        cuisine: "Italian",
        category: "Snack",
        cooking_time: "20m",
        servings: 4,
        image_url: "https://www.allrecipes.com/thmb/sYqiSV2aD9s5AoS9idAR4M5yOCE=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/21080-great-garlic-bread-DDMFS-4x3-e1c7b5c79fde4d629a9b7bce6c0702ed.jpg",
        youtube_url: "https://www.youtube.com/watch?v=ZxZO9wdOHPU",
        ingredients_json: JSON.stringify([
            { name: "Baguette", quantity: "1", unit: "pc" },
            { name: "Butter", quantity: "4", unit: "tbsp" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Parsley", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "0.5", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Preheat oven to 375°F (190°C).",
            "Mix softened butter with minced garlic, chopped parsley, and a pinch of salt.",
            "Spread garlic butter on bread slices.",
            "Bake for 10-12 minutes until golden and crispy.",
            "Serve warm."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 200, protein: 5, carbs: 25, fat: 10 })
    },
    {
        title: "Vegetable Fried Rice",
        description: "Quick and flavorful stir-fried rice with mixed vegetables.",
        cuisine: "Chinese",
        category: "Main Course",
        cooking_time: "25m",
        servings: 4,
        image_url: "https://veryveganish.com/wp-content/uploads/2024/07/Vegetable-Fried-Rice-no-egg-oil-free-21-1024x1536.jpg",
        youtube_url: "https://youtu.be/ZTgVFe4_H-s",
        ingredients_json: JSON.stringify([
            { name: "Basmati Rice", quantity: "2", unit: "cups" },
            { name: "Carrots", quantity: "1", unit: "medium" },
            { name: "Peas", quantity: "0.5", unit: "cup" },
            { name: "Capsicum", quantity: "1", unit: "medium" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Soy Sauce", quantity: "2", unit: "tbsp" },
            { name: "Sesame Oil", quantity: "1", unit: "tbsp" },
            { name: "Green Onions", quantity: "2", unit: "stalks" }
        ]),
        steps_json: JSON.stringify([
            "Cook rice and let it cool to prevent sticking.",
            "Heat sesame oil in a wok and sauté garlic and onions until aromatic.",
            "Add chopped vegetables and stir-fry until tender-crisp.",
            "Add rice and soy sauce, stir well to combine.",
            "Garnish with chopped green onions and serve hot."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 250, protein: 6, carbs: 45, fat: 6 })
    },
    {
        title: "Chicken Chow Mein",
        description: "Stir-fried noodles with chicken and vegetables in savory sauce.",
        cuisine: "Chinese",
        category: "Main Course",
        cooking_time: "30m",
        servings: 4,
        image_url: "https://www.recipetineats.com/tachyon/2018/08/Chow-Mein_1.jpg?resize=900%2C1260&zoom=0.86",
        youtube_url: "https://youtu.be/HAaWK5asouM",
        ingredients_json: JSON.stringify([
            { name: "Noodles", quantity: "200", unit: "g" },
            { name: "Chicken", quantity: "200", unit: "g" },
            { name: "Carrots", quantity: "1", unit: "medium" },
            { name: "Cabbage", quantity: "1", unit: "cup" },
            { name: "Capsicum", quantity: "1", unit: "medium" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Soy Sauce", quantity: "2", unit: "tbsp" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Ginger", quantity: "1", unit: "inch" },
            { name: "Sesame Oil", quantity: "1", unit: "tbsp" }
        ]),
        steps_json: JSON.stringify([
            "Cook noodles according to package instructions and drain.",
            "Heat sesame oil in a wok, sauté garlic and ginger until fragrant.",
            "Add chicken pieces and cook until lightly browned.",
            "Add vegetables and stir-fry until tender-crisp.",
            "Add noodles and soy sauce, toss well to combine.",
            "Serve hot."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 400, protein: 25, carbs: 55, fat: 12 })
    },
    {
        title: "Chicken Manchurian",
        description: "Crispy chicken pieces in a flavorful Indo-Chinese sauce.",
        cuisine: "Chinese",
        category: "Main Course",
        cooking_time: "40m",
        servings: 4,
        image_url: "https://www.chilitochoc.com/wp-content/uploads/2024/11/serving-spoon-in-manchurian-gravy-1024x1536.jpg",
        youtube_url: "https://youtu.be/I01Accjb8KY",
        ingredients_json: JSON.stringify([
            { name: "Chicken", quantity: "500", unit: "g" },
            { name: "Cornstarch", quantity: "4", unit: "tbsp" },
            { name: "Garlic", quantity: "1", unit: "tbsp" },
            { name: "Ginger", quantity: "1", unit: "tbsp" },
            { name: "Soy Sauce", quantity: "2", unit: "tbsp" },
            { name: "Tomato Ketchup", quantity: "2", unit: "tbsp" },
            { name: "Chili Sauce", quantity: "1", unit: "tbsp" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Capsicum", quantity: "1", unit: "medium" }
        ]),
        steps_json: JSON.stringify([
            "Coat chicken pieces in cornstarch and shallow fry until golden.",
            "Heat oil, sauté garlic and ginger, then add onions and capsicum.",
            "Add sauces (soy, chili, ketchup) and a little water to make gravy.",
            "Add fried chicken and toss to coat evenly.",
            "Simmer for 5 minutes and serve hot."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 450, protein: 30, carbs: 20, fat: 25 })
    },
    {
        title: "Vegetable Spring Rolls",
        description: "Crispy rolls stuffed with seasoned mixed vegetables.",
        cuisine: "Chinese",
        category: "Snack",
        cooking_time: "35m",
        servings: 4,
        image_url: "https://herbsandflour.com/wp-content/uploads/2023/10/Crispy-Vegetable-Spring-Rolls-Recipe-1187x1536.jpg",
        youtube_url: "https://youtu.be/B5HdAw_Y0TU",
        ingredients_json: JSON.stringify([
            { name: "Spring Roll Wrappers", quantity: "10", unit: "sheets" },
            { name: "Cabbage", quantity: "1", unit: "cup" },
            { name: "Carrots", quantity: "1", unit: "cup" },
            { name: "Capsicum", quantity: "0.5", unit: "cup" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Garlic", quantity: "2", unit: "cloves" },
            { name: "Soy Sauce", quantity: "1", unit: "tbsp" },
            { name: "Oil", quantity: "2", unit: "cups" }
        ]),
        steps_json: JSON.stringify([
            "Shred vegetables and sauté with garlic and soy sauce until tender.",
            "Place filling on spring roll wrappers and roll tightly, sealing edges with water.",
            "Deep fry rolls until golden and crispy.",
            "Drain excess oil and serve with sweet chili sauce."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 180, protein: 4, carbs: 25, fat: 7 })
    },
    {
        title: "Sushi Rolls",
        description: "Rice and fillings wrapped in seaweed sheets.",
        cuisine: "Japanese",
        category: "Snack",
        cooking_time: "45m",
        servings: 4,
        image_url: "https://www.justonecookbook.com/wp-content/uploads/2020/01/Sushi-Rolls-Maki-Sushi-%E2%80%93-Hosomaki-1106-II.jpg",
        youtube_url: "https://www.youtube.com/watch?v=WJ_U71a5t-M",
        ingredients_json: JSON.stringify([
            { name: "Sushi Rice", quantity: "2", unit: "cups" },
            { name: "Nori Sheets", quantity: "4", unit: "sheets" },
            { name: "Cucumber", quantity: "1", unit: "medium" },
            { name: "Avocado", quantity: "1", unit: "medium" },
            { name: "Crab Stick", quantity: "4", unit: "pcs" },
            { name: "Soy Sauce", quantity: "2", unit: "tbsp" },
            { name: "Wasabi", quantity: "1", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Cook sushi rice and season with rice vinegar, sugar, and salt.",
            "Place nori sheet on bamboo mat and spread rice evenly.",
            "Arrange fillings (cucumber, avocado, crab stick) in a line.",
            "Roll tightly using bamboo mat and seal edge with water.",
            "Slice into pieces and serve with soy sauce and wasabi."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 200, protein: 6, carbs: 35, fat: 4 })
    },
    {
        title: "Chicken Alfredo Pasta",
        description: "Creamy pasta with chicken and Alfredo sauce.",
        cuisine: "Italian",
        category: "Main Course",
        cooking_time: "30m",
        servings: 4,
        image_url: "https://gimmedelicious.com/wp-content/uploads/2024/10/Skinny-Chicken-Broccoli-Alfredo-1097x1536.jpg",
        youtube_url: "https://youtu.be/F7CU0qBdj04",
        ingredients_json: JSON.stringify([
            { name: "Fettuccine Pasta", quantity: "250", unit: "g" },
            { name: "Chicken", quantity: "200", unit: "g" },
            { name: "Butter", quantity: "2", unit: "tbsp" },
            { name: "Garlic", quantity: "2", unit: "cloves" },
            { name: "Cream", quantity: "1", unit: "cup" },
            { name: "Parmesan Cheese", quantity: "0.5", unit: "cup" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Pepper", quantity: "0.5", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Cook pasta according to package instructions and drain.",
            "Cook chicken in butter until golden and cooked through.",
            "Add garlic and cook until aromatic, then add cream and Parmesan.",
            "Simmer sauce until thickened, season with salt and pepper.",
            "Toss pasta with sauce and chicken, serve hot."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 550, protein: 35, carbs: 55, fat: 25 })
    },
    {
        title: "Vegetable Lasagna",
        description: "Layered pasta with vegetables, cheese, and tomato sauce.",
        cuisine: "Italian",
        category: "Main Course",
        cooking_time: "50m",
        servings: 6,
        image_url: "https://cdn.loveandlemons.com/wp-content/uploads/2023/12/vegetarian-lasagna-recipe.jpg",
        youtube_url: "https://www.youtube.com/watch?v=G6KsVBugkgA",
        ingredients_json: JSON.stringify([
            { name: "Lasagna Sheets", quantity: "9", unit: "sheets" },
            { name: "Tomato Sauce", quantity: "2", unit: "cups" },
            { name: "Zucchini", quantity: "1", unit: "medium" },
            { name: "Spinach", quantity: "1", unit: "cup" },
            { name: "Carrots", quantity: "1", unit: "medium" },
            { name: "Mozzarella Cheese", quantity: "1", unit: "cup" },
            { name: "Ricotta Cheese", quantity: "1", unit: "cup" },
            { name: "Olive Oil", quantity: "1", unit: "tbsp" }
        ]),
        steps_json: JSON.stringify([
            "Preheat oven to 375°F (190°C).",
            "Sauté chopped vegetables until tender.",
            "Layer tomato sauce, vegetables, ricotta, and lasagna sheets in a baking dish.",
            "Top with mozzarella cheese and repeat layers if needed.",
            "Bake for 30-35 minutes until cheese is melted and bubbly.",
            "Let rest 5 minutes before slicing and serving."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 320, protein: 15, carbs: 35, fat: 15 })
    },
    {
        title: "Risotto",
        description: "Creamy Italian rice dish cooked slowly with broth.",
        cuisine: "Italian",
        category: "Main Course",
        cooking_time: "40m",
        servings: 4,
        image_url: "https://static01.nyt.com/images/2025/02/25/multimedia/Lobster-Risotto-cftz/Lobster-Risotto-cftz-jumbo.jpg?quality=75&auto=webp",
        youtube_url: "https://www.youtube.com/watch?v=NKtR3KpS83w",
        ingredients_json: JSON.stringify([
            { name: "Arborio Rice", quantity: "1.5", unit: "cups" },
            { name: "Broth", quantity: "4", unit: "cups" },
            { name: "Butter", quantity: "2", unit: "tbsp" },
            { name: "Onion", quantity: "1", unit: "small" },
            { name: "Garlic", quantity: "2", unit: "cloves" },
            { name: "Parmesan Cheese", quantity: "0.5", unit: "cup" },
            { name: "White Wine", quantity: "0.5", unit: "cup" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Pepper", quantity: "0.5", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Heat broth and keep warm on low heat.",
            "Sauté onion and garlic in butter until translucent.",
            "Add rice and toast for 1-2 minutes.",
            "Deglaze with white wine and cook until absorbed.",
            "Gradually add warm broth, stirring continuously until rice is creamy and cooked.",
            "Stir in Parmesan, season with salt and pepper, and serve hot."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 350, protein: 10, carbs: 60, fat: 12 })
    },
    {
        title: "Caesar Salad",
        description: "Crisp romaine lettuce with creamy Caesar dressing, croutons, and Parmesan.",
        cuisine: "Italian",
        category: "Salad",
        cooking_time: "15m",
        servings: 4,
        image_url: "https://cdn.loveandlemons.com/wp-content/uploads/2024/12/caesar-salad-recipe-1160x1567.jpg",
        youtube_url: "https://www.youtube.com/watch?v=kZi_MwnuNaE",
        ingredients_json: JSON.stringify([
            { name: "Romaine Lettuce", quantity: "1", unit: "head" },
            { name: "Croutons", quantity: "1", unit: "cup" },
            { name: "Parmesan Cheese", quantity: "0.25", unit: "cup" },
            { name: "Caesar Dressing", quantity: "0.25", unit: "cup" },
            { name: "Lemon Juice", quantity: "1", unit: "tbsp" },
            { name: "Olive Oil", quantity: "1", unit: "tbsp" }
        ]),
        steps_json: JSON.stringify([
            "Wash and chop romaine lettuce.",
            "Toss lettuce with Caesar dressing, lemon juice, and olive oil.",
            "Add croutons and grated Parmesan cheese.",
            "Toss gently and serve immediately."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 200, protein: 6, carbs: 12, fat: 14 })
    },
    {
        title: "Russian Borscht",
        description: "Hearty beetroot soup with vegetables and a hint of sour cream.",
        cuisine: "Russian",
        category: "Soup",
        cooking_time: "60m",
        servings: 4,
        image_url: "https://natashaskitchen.com/wp-content/uploads/2018/10/Borscht-Recipe-2-1024x1536.jpg",
        youtube_url: "https://www.youtube.com/watch?v=iFWuKOU4qzU",
        ingredients_json: JSON.stringify([
            { name: "Beets", quantity: "3", unit: "medium" },
            { name: "Cabbage", quantity: "0.5", unit: "head" },
            { name: "Carrots", quantity: "2", unit: "medium" },
            { name: "Onion", quantity: "1", unit: "medium" },
            { name: "Potatoes", quantity: "2", unit: "medium" },
            { name: "Tomato Paste", quantity: "2", unit: "tbsp" },
            { name: "Vegetable Broth", quantity: "4", unit: "cups" },
            { name: "Sour Cream", quantity: "0.5", unit: "cup" },
            { name: "Dill", quantity: "1", unit: "tbsp" }
        ]),
        steps_json: JSON.stringify([
            "Peel and chop vegetables.",
            "Sauté onions, carrots, and beets in a pot.",
            "Add vegetable broth, tomato paste, and potatoes; simmer until tender.",
            "Add chopped cabbage and cook for 10 more minutes.",
            "Serve hot with a dollop of sour cream and fresh dill."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 150, protein: 4, carbs: 25, fat: 5 })
    },
    {
        title: "Blini Pancakes",
        description: "Soft Russian pancakes perfect with sweet or savory toppings.",
        cuisine: "Russian",
        category: "Dessert",
        cooking_time: "30m",
        servings: 4,
        image_url: "https://www.allrecipes.com/thmb/aWj6pmu3mMIVYHfpC4LulcdzP7w=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-260537-easy-blini-russian-pancake-DDMFS-4x3-beauty-0f3dd3a823054d82bb92bf9546ecc12b.jpg",
        youtube_url: "https://www.youtube.com/watch?v=MJbqrcf6SyI",
        ingredients_json: JSON.stringify([
            { name: "Flour", quantity: "1", unit: "cup" },
            { name: "Milk", quantity: "1.5", unit: "cups" },
            { name: "Eggs", quantity: "2", unit: "large" },
            { name: "Sugar", quantity: "1", unit: "tbsp" },
            { name: "Salt", quantity: "0.5", unit: "tsp" },
            { name: "Butter", quantity: "2", unit: "tbsp" },
            { name: "Yeast", quantity: "1", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Mix flour, yeast, sugar, salt, eggs, and milk to form a smooth batter.",
            "Let batter rest for 30 minutes to rise.",
            "Heat a non-stick pan and melt a little butter.",
            "Pour small amounts of batter to make pancakes and cook until bubbles form, then flip.",
            "Serve warm with toppings of choice (honey, jam, or sour cream)."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 120, protein: 4, carbs: 20, fat: 3 })
    },
    {
        title: "Potato Dumplings",
        description: "Soft and tender dumplings made from potatoes, perfect as a side dish.",
        cuisine: "European",
        category: "Side Dish",
        cooking_time: "40m",
        servings: 4,
        image_url: "https://s.lightorangebean.com/media/20241006225039/Simple-Vegan-Potato-Dumplings_done.jpg",
        youtube_url: "https://www.youtube.com/watch?v=3IZFd0l4vQM&pp=ygUQUG90YXRvIER1bXBsaW5ncw%3D%3D",
        ingredients_json: JSON.stringify([
            { name: "Potatoes", quantity: "1", unit: "kg" },
            { name: "Flour", quantity: "1", unit: "cup" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Nutmeg", quantity: "0.25", unit: "tsp" },
            { name: "Oil or Butter", quantity: "2", unit: "tbsp" }
        ]),
        steps_json: JSON.stringify([
            "Boil potatoes until tender and mash them.",
            "Mix mashed potatoes with flour, salt, and nutmeg to form a dough.",
            "Shape dough into small dumplings.",
            "Boil dumplings in salted water until they float.",
            "Serve with butter or sauce."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 180, protein: 4, carbs: 35, fat: 2 })
    },
    {
        title: "Gulab Jamun",
        description: "Soft, sweet syrup-soaked dumplings made from milk solids.",
        cuisine: "Indian",
        category: "Dessert",
        cooking_time: "45m",
        servings: 4,
        image_url: "https://www.spiceupthecurry.com/wp-content/uploads/2020/08/gulab-jamun-recipe-1-1024x1536.jpg",
        youtube_url: "https://www.youtube.com/watch?v=aUFO-YnWslw&pp=ygULR3VsYWIgSmFtdW4%3D",
        ingredients_json: JSON.stringify([
            { name: "Khoya/Milk Solids", quantity: "1", unit: "cup" },
            { name: "Flour", quantity: "2", unit: "tbsp" },
            { name: "Milk", quantity: "2", unit: "tbsp" },
            { name: "Sugar", quantity: "2", unit: "cups" },
            { name: "Cardamom", quantity: "4", unit: "pods" },
            { name: "Oil for Frying", quantity: "2", unit: "cups" },
            { name: "Rose Water", quantity: "1", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Prepare dough using khoya, flour, and a little milk.",
            "Shape into small balls.",
            "Fry in oil until golden brown.",
            "Prepare sugar syrup with sugar, water, cardamom, and rose water.",
            "Soak fried balls in warm syrup for at least 30 minutes before serving."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 250, protein: 4, carbs: 35, fat: 10 })
    },
    {
        title: "Ras Malai",
        description: "Soft cheese patties soaked in sweet, creamy milk flavored with cardamom.",
        cuisine: "Indian",
        category: "Dessert",
        cooking_time: "60m",
        servings: 4,
        image_url: "https://eatsbyramya.com/wp-content/uploads/2024/10/rasmalai_can_recipe-1024x1024.jpg",
        youtube_url: "https://www.youtube.com/watch?v=I1QJUhXAt_c&pp=ygUJUmFzIE1hbGFp",
        ingredients_json: JSON.stringify([
            { name: "Paneer/Cottage Cheese", quantity: "1", unit: "cup" },
            { name: "Sugar", quantity: "1", unit: "cup" },
            { name: "Milk", quantity: "1", unit: "liter" },
            { name: "Cardamom", quantity: "4", unit: "pods" },
            { name: "Saffron", quantity: "0.5", unit: "tsp" },
            { name: "Rose Water", quantity: "1", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Shape paneer into small patties.",
            "Boil in sugar syrup until spongy and cooked.",
            "Simmer milk with cardamom and saffron until slightly thickened.",
            "Soak cooked patties in flavored milk for several hours.",
            "Serve chilled."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 200, protein: 8, carbs: 25, fat: 8 })
    },
    {
        title: "Kheer",
        description: "Creamy rice pudding flavored with saffron and cardamom.",
        cuisine: "Indian",
        category: "Dessert",
        cooking_time: "50m",
        servings: 4,
        image_url: "https://mypahadidukan.com/cdn/shop/articles/Kesar_Kheer_Recipe_ad0e3b6b-d2aa-45b9-89e0-a7e986ea0bec.jpg?v=1761216555&width=940",
        youtube_url: "https://www.youtube.com/watch?v=OO6P52txuy0&pp=ygUFS2hlZXI%3D",
        ingredients_json: JSON.stringify([
            { name: "Basmati Rice", quantity: "0.25", unit: "cup" },
            { name: "Milk", quantity: "1", unit: "liter" },
            { name: "Sugar", quantity: "0.5", unit: "cup" },
            { name: "Saffron", quantity: "0.5", unit: "tsp" },
            { name: "Cardamom", quantity: "0.5", unit: "tsp" },
            { name: "Nuts", quantity: "2", unit: "tbsp" }
        ]),
        steps_json: JSON.stringify([
            "Boil milk in a pot.",
            "Add rice and cook on low heat until soft and creamy.",
            "Add sugar, saffron, and cardamom.",
            "Cook for a few more minutes, stirring constantly.",
            "Garnish with chopped nuts and serve hot or chilled."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 250, protein: 6, carbs: 40, fat: 8 })
    },
    {
        title: "Baklava",
        description: "Crispy layered pastry filled with nuts and sweet syrup.",
        cuisine: "Middle Eastern",
        category: "Dessert",
        cooking_time: "60m",
        servings: 8,
        image_url: "https://cakesbymk.com/wp-content/uploads/2025/03/Template-Size-for-Blog-40-1203x1536.jpg",
        youtube_url: "https://www.youtube.com/watch?v=OkzpwHodaAs&pp=ygUHQmFrbGF2YQ%3D%3D",
        ingredients_json: JSON.stringify([
            { name: "Phyllo Dough", quantity: "1", unit: "roll" },
            { name: "Butter", quantity: "1", unit: "cup" },
            { name: "Chopped Nuts", quantity: "2", unit: "cups" },
            { name: "Sugar", quantity: "1", unit: "cup" },
            { name: "Honey", quantity: "0.5", unit: "cup" },
            { name: "Cinnamon", quantity: "1", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Layer phyllo sheets with melted butter in a baking dish.",
            "Sprinkle chopped nuts and cinnamon between layers.",
            "Bake until golden brown.",
            "Prepare sugar-honey syrup and pour over hot pastry.",
            "Cut into pieces and serve after cooling slightly."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 300, protein: 5, carbs: 35, fat: 15 })
    },
    {
        title: "Kunafa",
        description: "Sweet Middle Eastern dessert with crispy layers and cream filling.",
        cuisine: "Middle Eastern",
        category: "Dessert",
        cooking_time: "50m",
        servings: 6,
        image_url: "https://butfirstchai.com/wp-content/uploads/2022/08/kunafa-with-cream-1152x1536.jpg",
        youtube_url: "https://www.youtube.com/watch?v=7XiDgUhmMIs&pp=ygUGS3VuYWZh",
        ingredients_json: JSON.stringify([
            { name: "Kunafa Dough", quantity: "500", unit: "g" },
            { name: "Butter", quantity: "1", unit: "cup" },
            { name: "Cream", quantity: "2", unit: "cups" },
            { name: "Sugar Syrup", quantity: "1", unit: "cup" },
            { name: "Pistachios", quantity: "0.25", unit: "cup" }
        ]),
        steps_json: JSON.stringify([
            "Layer kunafa dough with melted butter in a pan.",
            "Bake until golden and crispy.",
            "Prepare cream filling and spread over baked dough.",
            "Pour sugar syrup on top and garnish with pistachios.",
            "Serve warm."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 350, protein: 6, carbs: 45, fat: 15 })
    },
    {
        title: "Chocolate Cake",
        description: "Moist and rich chocolate cake perfect for dessert or celebrations.",
        cuisine: "European",
        category: "Dessert",
        cooking_time: "60m",
        servings: 8,
        image_url: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/easy_chocolate_cake_31070_16x9.jpg",
        youtube_url: "https://www.youtube.com/watch?v=vI5w-fK25w4&pp=ygUOQ2hvY29sYXRlIENha2U%3D",
        ingredients_json: JSON.stringify([
            { name: "Flour", quantity: "1.5", unit: "cups" },
            { name: "Cocoa Powder", quantity: "0.5", unit: "cup" },
            { name: "Sugar", quantity: "1.5", unit: "cups" },
            { name: "Eggs", quantity: "2", unit: "large" },
            { name: "Butter", quantity: "0.5", unit: "cup" },
            { name: "Baking Powder", quantity: "1", unit: "tsp" },
            { name: "Milk", quantity: "1", unit: "cup" },
            { name: "Vanilla Extract", quantity: "1", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Preheat oven to 350°F (175°C).",
            "Mix dry ingredients: flour, cocoa powder, and baking powder.",
            "Cream butter and sugar, then add eggs and vanilla.",
            "Combine wet and dry ingredients and add milk gradually.",
            "Pour batter into a greased pan and bake for 35-40 minutes.",
            "Cool and frost if desired, then serve."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 400, protein: 6, carbs: 55, fat: 18 })
    },
    {
        title: "Brownies",
        description: "Fudgy chocolate brownies with a rich texture.",
        cuisine: "European",
        category: "Dessert",
        cooking_time: "40m",
        servings: 8,
        image_url: "https://cakesbymk.com/wp-content/uploads/2023/01/Template-Size-for-Blog-Photos-15-1203x1536.jpg",
        youtube_url: "https://www.youtube.com/watch?v=VvJm4pQZ04s&pp=ygUIQnJvd25pZXPSBwkJTQoBhyohjO8%3D",
        ingredients_json: JSON.stringify([
            { name: "Butter", quantity: "0.5", unit: "cup" },
            { name: "Chocolate", quantity: "200", unit: "g" },
            { name: "Sugar", quantity: "1", unit: "cup" },
            { name: "Eggs", quantity: "2", unit: "large" },
            { name: "Flour", quantity: "0.5", unit: "cup" },
            { name: "Vanilla Extract", quantity: "1", unit: "tsp" },
            { name: "Salt", quantity: "0.25", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Preheat oven to 350°F (175°C).",
            "Melt butter and chocolate together.",
            "Whisk in sugar and eggs until smooth.",
            "Fold in flour and salt gently.",
            "Pour batter into a greased pan and bake for 25-30 minutes.",
            "Cool before slicing into squares."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 300, protein: 5, carbs: 35, fat: 18 })
    },
    {
        title: "Pancakes",
        description: "Fluffy breakfast pancakes perfect with syrup or fruits.",
        cuisine: "American",
        category: "Breakfast",
        cooking_time: "20m",
        servings: 4,
        image_url: "https://hips.hearstapps.com/hmg-prod/images/pancakes-lead-64c95a0412264.jpg",
        youtube_url: "https://www.youtube.com/watch?v=vkcHmpKxFwg&pp=ygUIUGFuY2FrZXM%3D",
        ingredients_json: JSON.stringify([
            { name: "Flour", quantity: "1.5", unit: "cups" },
            { name: "Milk", quantity: "1.25", unit: "cups" },
            { name: "Eggs", quantity: "1", unit: "large" },
            { name: "Baking Powder", quantity: "3.5", unit: "tsp" },
            { name: "Sugar", quantity: "1", unit: "tbsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Butter", quantity: "3", unit: "tbsp" }
        ]),
        steps_json: JSON.stringify([
            "Mix flour, sugar, baking powder, and salt.",
            "Whisk in milk and eggs to form a smooth batter.",
            "Heat a non-stick pan and melt a little butter.",
            "Pour batter onto pan and cook until bubbles form, then flip.",
            "Serve warm with syrup, honey, or fruits."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 180, protein: 5, carbs: 30, fat: 4 })
    },
    {
        title: "Waffles",
        description: "Crispy on the outside, fluffy on the inside breakfast waffles.",
        cuisine: "American",
        category: "Breakfast",
        cooking_time: "25m",
        servings: 4,
        image_url: "https://greengiantvegetables.com/wp-content/uploads/Corn-Lovers-Waffles-IMG-9.jpg.webp",
        youtube_url: "https://www.youtube.com/watch?v=iR64hfkGQeU&pp=ygUHV2FmZmxlcw%3D%3D",
        ingredients_json: JSON.stringify([
            { name: "Flour", quantity: "2", unit: "cups" },
            { name: "Baking Powder", quantity: "1", unit: "tbsp" },
            { name: "Sugar", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "0.5", unit: "tsp" },
            { name: "Eggs", quantity: "2", unit: "large" },
            { name: "Milk", quantity: "1.5", unit: "cups" },
            { name: "Butter", quantity: "0.5", unit: "cup" },
            { name: "Vanilla Extract", quantity: "1", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Preheat waffle iron.",
            "Mix dry ingredients: flour, baking powder, sugar, and salt.",
            "Whisk in eggs, milk, melted butter, and vanilla.",
            "Pour batter onto waffle iron and cook until golden brown.",
            "Serve hot with syrup or toppings of choice."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 220, protein: 6, carbs: 30, fat: 8 })
    },
    {
        title: "Mango Smoothie",
        description: "Refreshing smoothie made with ripe mangoes and yogurt.",
        cuisine: "Beverage",
        category: "Drink",
        cooking_time: "10m",
        servings: 2,
        image_url: "https://greenheartlove.com/wp-content/uploads/2022/08/tropical-mango-smoothie-vegan-1024x683.jpg",
        youtube_url: "https://www.youtube.com/watch?v=kv9Qux0IEno&pp=ygUOTWFuZ28gU21vb3RoaWU%3D",
        ingredients_json: JSON.stringify([
            { name: "Ripe Mangoes", quantity: "2", unit: "medium" },
            { name: "Yogurt", quantity: "1", unit: "cup" },
            { name: "Milk", quantity: "0.5", unit: "cup" },
            { name: "Honey", quantity: "1", unit: "tbsp" },
            { name: "Ice Cubes", quantity: "1", unit: "cup" }
        ]),
        steps_json: JSON.stringify([
            "Peel and chop mangoes.",
            "Blend mangoes with yogurt, milk, honey, and ice cubes until smooth.",
            "Pour into glasses and serve chilled."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 150, protein: 4, carbs: 30, fat: 1 })
    },
    {
        title: "Fresh Lemonade",
        description: "Cool and tangy lemonade perfect for hot days.",
        cuisine: "Beverage",
        category: "Drink",
        cooking_time: "10m",
        servings: 4,
        image_url: "https://myincrediblerecipes.com/wp-content/uploads/2023/02/set-2-Lemonade-3-1024x1536.jpg",
        youtube_url: "https://www.youtube.com/watch?v=5_sHXJC9ocA&pp=ygUORnJlc2ggTGVtb25hZGU%3D",
        ingredients_json: JSON.stringify([
            { name: "Lemons", quantity: "3", unit: "pcs" },
            { name: "Sugar", quantity: "0.5", unit: "cup" },
            { name: "Water", quantity: "4", unit: "cups" },
            { name: "Ice Cubes", quantity: "2", unit: "cups" },
            { name: "Mint Leaves", quantity: "0.25", unit: "cup" }
        ]),
        steps_json: JSON.stringify([
            "Squeeze fresh lemon juice into a pitcher.",
            "Add sugar and stir until dissolved.",
            "Add water and ice cubes, mix well.",
            "Garnish with mint leaves and serve chilled."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 50, protein: 0, carbs: 13, fat: 0 })
    },
    {
        title: "Mint Mojito",
        description: "Refreshing mint-flavored mocktail with lime and soda.",
        cuisine: "Beverage",
        category: "Drink",
        cooking_time: "10m",
        servings: 2,
        image_url: "https://www.sustainablecooks.com/wp-content/uploads/2018/06/Classic-Virgin-Mojito-Recipe-2.jpg",
        youtube_url: "https://www.youtube.com/watch?v=4VSF56JyDkU&pp=ygULTWludCBNb2ppdG8%3D",
        ingredients_json: JSON.stringify([
            { name: "Mint Leaves", quantity: "0.5", unit: "cup" },
            { name: "Lime", quantity: "2", unit: "pcs" },
            { name: "Sugar", quantity: "2", unit: "tbsp" },
            { name: "Soda Water", quantity: "1", unit: "cup" },
            { name: "Ice Cubes", quantity: "1", unit: "cup" }
        ]),
        steps_json: JSON.stringify([
            "Muddle mint leaves with sugar and lime juice.",
            "Add ice cubes to the glass.",
            "Top with soda water and stir gently.",
            "Garnish with extra mint leaves and serve chilled."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 30, protein: 0, carbs: 8, fat: 0 })
    },
    {
        title: "Grilled Chicken Bowl",
        description: "Healthy bowl with grilled chicken, rice, and fresh vegetables.",
        cuisine: "American",
        category: "Main Course",
        cooking_time: "30m",
        servings: 2,
        image_url: "https://healthyfitnessmeals.com/wp-content/uploads/2018/08/Grilled-chicken-burrito-bowls-4-819x1024.jpg",
        youtube_url: "https://www.youtube.com/watch?v=EAmC5DhRbz4&pp=ygUUR3JpbGxlZCBDaGlja2VuIEJvd2w%3D",
        ingredients_json: JSON.stringify([
            { name: "Chicken Breast", quantity: "2", unit: "pcs" },
            { name: "Rice", quantity: "1", unit: "cup" },
            { name: "Mixed Vegetables", quantity: "1", unit: "cup" },
            { name: "Olive Oil", quantity: "2", unit: "tbsp" },
            { name: "Salt", quantity: "0.5", unit: "tsp" },
            { name: "Pepper", quantity: "0.5", unit: "tsp" },
            { name: "Lemon", quantity: "1", unit: "pc" }
        ]),
        steps_json: JSON.stringify([
            "Season chicken with salt, pepper, and olive oil.",
            "Grill chicken until fully cooked.",
            "Cook rice according to package instructions.",
            "Assemble bowls with rice, grilled chicken, and steamed vegetables.",
            "Drizzle with lemon juice and serve."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 400, protein: 35, carbs: 45, fat: 10 })
    },
    {
        title: "Quinoa Salad",
        description: "Nutritious salad with quinoa, vegetables, and light dressing.",
        cuisine: "International",
        category: "Salad",
        cooking_time: "20m",
        servings: 2,
        image_url: "https://cookieandkate.com/images/2017/08/best-quinoa-salad-recipe-3.jpg",
        youtube_url: "https://www.youtube.com/watch?v=pcH3isHdOzA&pp=ygUMUXVpbm9hIFNhbGFk",
        ingredients_json: JSON.stringify([
            { name: "Quinoa", quantity: "1", unit: "cup" },
            { name: "Cucumber", quantity: "1", unit: "medium" },
            { name: "Tomatoes", quantity: "1", unit: "medium" },
            { name: "Red Onion", quantity: "0.5", unit: "medium" },
            { name: "Olive Oil", quantity: "2", unit: "tbsp" },
            { name: "Lemon Juice", quantity: "1", unit: "tbsp" },
            { name: "Salt", quantity: "0.5", unit: "tsp" },
            { name: "Pepper", quantity: "0.5", unit: "tsp" }
        ]),
        steps_json: JSON.stringify([
            "Cook quinoa and let it cool.",
            "Chop vegetables and mix with quinoa.",
            "Whisk olive oil, lemon juice, salt, and pepper to make dressing.",
            "Pour dressing over salad and toss well.",
            "Serve chilled or at room temperature."
        ]),
        nutritional_info_json: JSON.stringify({ calories: 220, protein: 8, carbs: 35, fat: 7 })
    }
];

const runSeeding = async () => {
    try {
        console.log("DELETING existing recipes...");
        await new Promise((resolve, reject) => {
            db.query("DELETE FROM recipes", (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        console.log(`INSERTING ${recipes.length} recipes...`);
        for (const r of recipes) {
            await new Promise((resolve, reject) => {
                db.query(
                    `INSERT INTO recipes (title, description, cuisine, category, cooking_time, servings, image_url, youtube_url, ingredients_json, steps_json, nutritional_info_json) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [r.title, r.description, r.cuisine, r.category, r.cooking_time, r.servings, r.image_url, r.youtube_url, r.ingredients_json, r.steps_json, r.nutritional_info_json],
                    (err) => { if (err) reject(err); else resolve(); }
                );
            });
        }
        console.log("SUCCESS: Recipes seeded.");
        process.exit();
    } catch (err) {
        console.error("SEED ERROR:", err);
        process.exit(1);
    }
};

runSeeding();
