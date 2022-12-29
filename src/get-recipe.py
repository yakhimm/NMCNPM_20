from bs4 import BeautifulSoup 
import bs4
import requests
import pandas as pd
import json
from os import walk

# Class RECIPE lưu các công thức crawl được về
class RECIPE:
    # Khi khởi tạo class thì các phần tử sau sẽ được khởi tạo
    def __init__(self, filepath):
        filenames = next(walk(filepath), (None, None, []))[2]  # [] if no file
        self.recipe = {}
        for filename in filenames:
            urls = pd.read_csv(filepath + filename).values
            # Danh sách các công thức là một dictionary      
            for i in range(len(urls)):
                # Nội dung của url
                content = requests.get(urls[i][0]).content
                # Dùng BeautifulSoup để lọc dữ liệu bằng html.parser
                self.soup = BeautifulSoup(content, 'html.parser')

                # Tên món
                detail_main = self.soup.find('div', {'class':'detail_main'})
                name = detail_main.find('div', {'class':'col'}).find('h1').get_text()

                self.tags = []
                self.tags.append('miền ' + filename[:-4])
                url_tag = detail_main.find('div', {'class':'tag mt-2'}).find_all('a')
                for tag in url_tag:
                    self.tags.append(tag.get_text())

                cachnau = ['chiên', 'xào', 'kho', 'canh', 'hấp', 'nướng', 'luộc', 'ngâm chua', 'rim', 'lẩu']
                self.cachnau = 0
                for item in cachnau:
                    if name != None and (item in name or item.title() in name):
                        tag = item
                        self.tags.append(tag)
                        self.cachnau = 1    
                        break
                # Lấy dữ liệu của từng url
                self.recipe[name] = self.request_and_get_recipe()
            
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
            raw_ingredient[i] = raw_ingredient[i].replace(':\t', '\t') 
            raw_ingredient[i] = raw_ingredient[i].replace('\t\t ', '\t')
            raw_ingredient[i] = raw_ingredient[i].replace('\t\t', '')
            raw_ingredient[i] = raw_ingredient[i].replace('\t', ': ')
            
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
        truth_content = truth_content.replace('\xa0','')
        truth_content = truth_content.replace('* ','')
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
    def request_and_get_recipe(self):
        recipe = {}

        # Lấy hình ảnh 
        detail_img = self.soup.find('div', {'class': 'detail_img w-100 float-left'})
        detail_img = detail_img.find('div', {'class': 'youtube text-center'})
        images = detail_img.findAll('img')
        for i in images:
            image = i['src']
        recipe['image'] = image
        # Biến đếm
        cnt = 0
        # Truy đến nhánh cần lấy dữ liệu
        detail_main_row_bm3 = self.soup.find_all('div', {'class': 'row mb-3'}) 
        # Vì trong web thì có 5 row mb-3
        # Mỗi row mb-3 có mỗi ý nghĩa khác nhau nên chỉ cần lấy 3 row mb-3 đầu là đủ dữ liệu
        for row_bm3 in detail_main_row_bm3:  
            if cnt == 0:
                # Lấy dữ liệu là nguyên liệu
                nguyenlieu = self.get_ingredient(row_bm3)
                recipe.update(nguyenlieu)
                monman = ['cá', 'thịt', 'bò', 'heo', 'sườn', 'gà', 'vịt', 'tôm', 'mực', 'cua']
                # Sau đó sẽ dựa trên nguyên liệu đánh giá món chay, mặn
                tag = 'món chay'
                for i in nguyenlieu['nguyenlieu']:
                    for item in monman:
                        if i != None and (item in i or item.title() in i):
                            tag = 'món mặn'
                            break            
                self.tags.append(tag) 
                          
            if cnt == 1:
                # Lấy dữ liệu là Sơ chế
                recipe.update(self.get_content_of_soup(row_bm3, 'soche'))
            if cnt == 2:
                thuchien = self.get_content_of_soup(row_bm3, 'thuchien')
                # Lấy dữ liệu là Thực hiện
                recipe.update(thuchien)
                # Nếu chưa biết cách nấu của món thì ta sẽ xác định trong cách thực hiện món:
                if self.cachnau == 0:
                    cachnau = ['chiên', 'xào', 'kho', 'canh', 'hấp', 'nướng', 'luộc', 'ngâm chua', 'rim', 'lẩu']
                    for i in thuchien['thuchien']:
                        for item in cachnau:
                            if i != None and (item in i or item.title() in i):
                                self.cachnau = 1
                                self.tags.append(item)
                                break     
            if cnt == 3:
                # Lấy dữ liệu là Cách dùng
                recipe.update(self.get_content_of_soup(row_bm3, 'cachdung'))
            if cnt == 4:
                # Lấy dữ liệu là Mách nhỏ
                recipe.update(self.get_content_of_soup(row_bm3, 'machnho'))
            # recipe.update()
            cnt += 1
        recipe['tags'] = self.tags
        return recipe

# file csv chứa các url
filepath = './csv/recipe/'
# Tạo một dictionary tên recipe là các công thức 
recipe = RECIPE(filepath).recipe

# Ghi các công thức ra file json
# Kết quả ghi ra không có dấu, tuy nhiên khi đọc vào bằng json thì kết quả đọc vào sẽ có dấu (read.csv có chứng minh)
with open("./db/recipe.json", "w") as outfile:
    json.dump(recipe, outfile)