from bs4 import BeautifulSoup 
import bs4
import requests
import pandas as pd
import json

# Class RECIPE lưu các công thức crawl được về
class RECIPE:
    # Khi khởi tạo class thì các phần tử sau sẽ được khởi tạo
    def __init__(self, filepath):
        urls = pd.read_csv(filepath).values
        # Danh sách các công thức là một dictionary
        self.recipe = {}
        for i in range(len(urls)):
            # Tên món
            name = urls[i][0].split('/')[3]
            # Lấy dữ liệu của từng url
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
        # Đưa về dictionary
        ingredient = {'nguyenlieu': raw_ingredient}
        return ingredient

    def get_contents(self, contents):
        truth_content = ''
        for content in contents:
            # Lấy và nối các content 
            # Nếu dữ liệu là một NavigableString thì là dữ liệu đúng định dạng         
            if (type(content) == bs4.element.NavigableString):
                truth_content += content
            # Nếu không thì đó là một Tag
            elif type(content) == bs4.element.Tag:
                # Khi là 1 Tag thì ta sẽ tiếp tục gọi đệ quy get_contents để truy suất ra 
                # cho đến khi đúng dữ liệu định dạng
                truth_content += self.get_contents(content)
        # Điều kiện dừng là khi hết contents
        # Kết quả trả về là truth_content
        return truth_content

    def get_content_of_soup(self, soup, case): 
        soup_contents = {}
        content = []
        # Tìm đến các Tag có nội dung cần lấy 
        soup_content_find_all = soup.find('div').find_all('p')
        if soup_content_find_all == []:
            # Trường hợp định dạng web khác nhau (1 định dạng là p, 1 định dạng là li)
            # Đây là trường hợp dự phòng các web thay đổi định dạng
            soup_content_find_all = soup.find('div').find_all('li')
        for soup_content in soup_content_find_all:
            content.append(self.get_contents(soup_content.contents))
        soup_contents = {case: content}
        # Trả về một dictionary
        return soup_contents

    # Hàm request lên url và lấy dữ liệu recipe từ url đó 
    def request_and_get_recipe(self, url):
        # Nội dung của url
        content = requests.get(url).content
        # Dùng BeautifulSoup để lọc dữ liệu bằng html.parser
        soup = BeautifulSoup(content, 'html.parser')
        # Biến đếm
        cnt = 0
        # Truy đến nhánh cần lấy dữ liệu
        detail_main_row_bm3 = soup.find_all('div', {'class': 'row mb-3'}) 
        recipe = {}
        # Vì trong web thì có 5 row mb-3
        # Mỗi row mb-3 có mỗi ý nghĩa khác nhau nên chỉ cần lấy 3 row mb-3 đầu là đủ dữ liệu
        for row_bm3 in detail_main_row_bm3:  
            if cnt == 0:
                # Lấy dữ liệu là nguyên liệu
                recipe.update(self.get_ingredient(row_bm3))
            if cnt == 1:
                # Lấy dữ liệu là Sơ chế
                recipe.update(self.get_content_of_soup(row_bm3, 'soche'))
            if cnt == 2:
                # Lấy dữ liệu là Thực hiện
                recipe.update(self.get_content_of_soup(row_bm3, 'thuchien'))
            cnt += 1
        return recipe

# file csv chứa các url
filepath = 'recipe_links.csv'
# Tạo một dictionary tên recipe là các công thức 
recipe = RECIPE(filepath).recipe
# Ghi các công thức ra file json
# Kết quả ghi ra không có dấu, tuy nhiên khi đọc vào bằng json thì kết quả đọc vào sẽ có dấu (read.csv có chứng minh)
with open("recipe.json", "w", encoding ='utf8') as outfile:
    json.dump(recipe, outfile)


print('ok')