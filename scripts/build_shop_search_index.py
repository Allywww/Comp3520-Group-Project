import json
import os
import re

CATEGORY_KEYWORDS = {
    'Fashion & Accessories': [
        'fashion', 'accessories', 'clothing', 'shoes', 'bags', 'jewellery', 'jewelry', 'watches', 'luxury', 'apparel'
    ],
    'Beauty, Skincare, Fragrance & Wellness': [
        'beauty', 'skincare', 'fragrance', 'perfume', 'wellness', 'makeup', 'cosmetics', 'salon', 'nail', 'spa'
    ],
    'Food & Beverage': [
        'food', 'restaurant', 'cafe', 'coffee', 'tea', 'dessert', 'eatery', 'dining', 'burger', 'italian', 'japanese'
    ],
    'Gourmet Food & Specialty Drinks': [
        'gourmet', 'specialty', 'wine', 'tea', 'coffee', 'chocolate', 'bakery', 'ingredients', 'premium', 'drink', 'liquor'
    ],
    'Lifestyle, Books, Electronics & Services': [
        'lifestyle', 'books', 'electronics', 'fitness', 'services', 'optical', 'audio', 'toys', 'stationery', 'mobile'
    ],
    'Department Stores & Large Multi-Brand Retailers': [
        'department', 'retailer', 'store', 'multi-brand', 'luxury', 'shopping'
    ],
}

ADDITIONAL_KEYWORDS = {
    'Apple Store': ['iphone', 'ipad', 'mac', 'accessories', 'apple'],
    'Starbucks Coffee': ['coffee', 'espresso', 'latte', 'tea'],
    'Blue Bottle Coffee': ['coffee', 'espresso', 'latte', 'beans'],
    '% Arabica': ['coffee', 'espresso', 'latte', 'beans'],
    'Nespresso': ['coffee', 'espresso', 'capsules'],
    'Tea WG': ['tea', 'tea shop', 'tea accessories'],
    'La Maison du Chocolat': ['chocolate', 'pastries', 'sweets'],
    'GODIVA Chocolatier': ['chocolate', 'truffles', 'gifts'],
    'COVA PASTICCERIA & CONFETTERIA': ['pastries', 'cakes', 'desserts'],
    'Pierre Hermé Paris': ['pastries', 'macarons', 'sweets'],
}


def normalize_text(text):
    return re.sub(r'[^0-9a-z]+', ' ', str(text or '')).strip().lower()


def tokenize(text):
    return [token for token in normalize_text(text).split() if token]


def build_keywords(node):
    keywords = set()
    keywords.update(tokenize(node.get('label')))
    keywords.update(tokenize(node.get('shortLabel')))

    if node.get('code'):
        keywords.update(re.findall(r'[0-9a-zA-Z]+', node['code']))
    if node.get('building'):
        keywords.update(tokenize(node['building']))
    if node.get('category'):
        keywords.add(node['category'].lower())
        category_terms = CATEGORY_KEYWORDS.get(node['category'], [])
        keywords.update(category_terms)

    additional = ADDITIONAL_KEYWORDS.get(node.get('label'))
    if additional:
        keywords.update(additional)

    # Add plural and common forms for better matching
    for token in list(keywords):
        if token.endswith('y') and len(token) > 3:
            keywords.add(token[:-1] + 'ies')
        if token.endswith('s') and len(token) > 3:
            keywords.add(token[:-1])

    return sorted({keyword for keyword in keywords if keyword})


def build_search_index(graph_path, output_path):
    with open(graph_path, 'r', encoding='utf-8') as f:
        graph = json.load(f)

    search_index = []
    for node in graph.get('nodes', []):
        if node.get('type') != 'shop':
            continue

        entry = {
            'id': node['id'],
            'label': node['label'],
            'code': node.get('code', ''),
            'category': node.get('category', ''),
            'level': node.get('level', 0),
            'building': node.get('building', ''),
            'keywords': build_keywords(node),
        }
        search_index.append(entry)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(search_index, f, ensure_ascii=False, indent=2)

    print(f'Built search index with {len(search_index)} shop entries.')


if __name__ == '__main__':
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    graph_path = os.path.join(root, 'data', 'graph.json')
    output_path = os.path.join(root, 'data', 'shop_search_index.json')
    build_search_index(graph_path, output_path)
