from bs4 import BeautifulSoup 
import bs4
import requests
import pandas as pd
import json

class RECIPE:
    def __init__(self, filepath):
        urls = pd.read_csv(filepath).values
        self.recipe = {}
        for i in range(len(urls)):
            name = urls[i][0].split('/')[3]
            self.recipe[name] = self.request_and_get_recipe(urls[i][0])

    def get_ingredient(self, soup):
        # Tìm đến mục div - class: block-nguyenlieu
        # Sau đó tìm các phần có mục là span 
        block_ingredient = soup.find('div', {'class':'block-nguyenlieu'}).find_all('span')
        raw_ingredient = []
        # Sau đó sẽ đọc từng content của các span đã lấy về và đưa vào raw_ingredient
        for ingredient in block_ingredient:
            raw_ingredient.append(ingredient.contents[0])
        # Split các dữ liệu có dấu \t trong nguyen liệu
        for i in range(len(raw_ingredient)):
            split = raw_ingredient[i].split("\t")[0]
            raw_ingredient[i] = split
        ingredient = {'nguyenlieu': raw_ingredient}
        return ingredient

    def get_contents(self, contents):
        truth_content = ''
        for content in contents:
            # Lấy và nối các content          
            if (type(content) == bs4.element.NavigableString):
                truth_content += content
            elif type(content) == bs4.element.Tag:
                truth_content += self.get_contents(content)
        return truth_content

    def get_content_of_soup(self, soup, case): 
        soup_contents = {}
        content = []
        soup_content_find_all = soup.find('div').find_all('p')
        for soup_content in soup_content_find_all:
            content.append(self.get_contents(soup_content.contents))
        soup_contents = {case: content}

        return soup_contents

    def request_and_get_recipe(self, url):
        content = requests.get(url).content
        soup = BeautifulSoup(content, 'html.parser')
        cnt = 0
        detail_main_row_bm3 = soup.find_all('div', {'class': 'row mb-3'}) 
        recipe = {}
        for row_bm3 in detail_main_row_bm3:  
            if cnt == 0:
                recipe.update(self.get_ingredient(row_bm3))
            if cnt == 1:
                recipe.update(self.get_content_of_soup(row_bm3, 'soche'))
            if cnt == 2:
                recipe.update(self.get_content_of_soup(row_bm3, 'thuchien'))
            cnt += 1

        return recipe

filepath = 'recipe_links.csv'
recipe = RECIPE(filepath).recipe
with open("recipe.json", "w", encoding ='utf8') as outfile:
    json.dump(recipe, outfile)