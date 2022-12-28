import pandas as pd
import json

path = 'recipe.csv'
def cart(path):
    # Đọc file path 
    with open(path) as f:
        recipes = json.load(f)
    # Biến cart sẽ lưu tên các nguyên liệu
    # Dùng set() để có thể loại bỏ các nguyên liệu trùng tên
    cart = set()
    for key in recipes:
        # Ta chỉ lấy 3 nguyên liệu đầu từ danh sách các nguyên liệu 
        # Vì 3 nguyên liệu đầu thường là nguyên liệu chính của món
        item = recipes[key]['nguyenlieu'][:3]
        # Chỉ lấy tên nguyên liệu
        item = [i.split(':')[0] for i in item]
        # Thêm vào cart
        cart = cart.union(item)
    # Ghi cart ra thành một file csv để dễ lưu trữ (với mã encoding = 'utf-16')
    df = pd.DataFrame(cart)
    df.to_csv('./cart.csv', index = False, encoding = 'utf-16')

def get_cart(input, output):
    # Đọc file input với encoding = 'utf-16', tách thành các cột theo sep = '\t'
    df = pd.read_csv(input, encoding = 'utf-16', sep = '\t', header = 0)
    # Biến cart là một dict() lưu trữ thông tin nguyên liệu
    cart = {}
    # Duyệt danh sách các nguyên liệu
    for i in range(len(df)):
        price = 'price'
        img = 'img'
        # Biến item là một dict() lưa trữ giá cả và hình ảnh của nguyên liệu
        item = { price : int(df.loc[i][price]), 
                 img : df.loc[i][img] }
        # Lưu vào cart với tên nguyên liệu chứa thông tin là item
        cart[df.loc[i]['item']] = item
    # Sau đó ta sẽ ghi vào file output
    with open(output, "w") as outfile:
        json.dump(cart, outfile)

if __name__ == '__main__':
    input = './csv/cart/cart.csv'
    output = './db/cart.json'
    get_cart(input, output)