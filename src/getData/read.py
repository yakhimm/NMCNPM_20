import json
  
# Opening JSON file
f = open('recipe.json')
  
# returns JSON object as 
# a dictionary
data = json.load(f)
  
# Iterating through the json
print(data)
  
# Closing file
f.close()