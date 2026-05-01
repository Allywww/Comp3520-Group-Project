import json

CATEGORY_MAP = {
    'Fashion & Accessories': [
        '45R', 'Acne Studios', 'agnès b. LA LOGGIA bis', 'AIGLE', 'alice + olivia by Stacey Bendet',
        'Alexandre Zouari', 'American Vintage', 'ANTEPRIMA', '愛彼', '始祖鳥', 'ATSURO TAYAMA', 'ba&sh',
        'Bottega Veneta', 'Boucheron', 'Brioni', 'Brunello Cucinelli', 'BVLGARI', 'Canada Goose',
        'CALVIN KLEIN UNDERWEAR', '卡地亞', 'CELINE', 'CHANEL Fashion', 'CHANEL Shoes', 'CHANEL Watches and Fine Jewellery',
        'CHAUMET', 'Chloé', '蕭邦', '周生生', 'Club Monaco', 'Damiani', 'DESCENTE', 'DIESEL', 'dunhill',
        'FALCONE', '法穆蘭', '斐登', 'Georg Jensen', 'Golden Goose Deluxe Brand®', 'HOBBS', 'HUBLOT',
        'IWC Schaffhausen', 'Jacadi', '積家', 'KKLUE', '老鋪黃金', 'Laurèl', '萊儷', 'LANVIN', '浪琴',
        'LOEWE', 'LORO PIANA', '瓏驤', 'lululemon athletica', 'MaBelle', 'Madia', 'Maison Margiela', 'Maje',
        'MARNI', 'Max Mara', 'MAX&Co.', 'MIKIMOTO', '萬寶龍', '盟可睞', 'MONICA VINADER', 'OLIVER PEOPLES',
        '沛納海', 'Paul Smith', 'POLO RALPH LAUREN', 'Pomellato', 'PANDORA', 'Qeelin', '勞力士', 'Royal Selangor',
        'RUE MADAME', 'Sam Edelman', 'Samsonite', 'SANDRO', 'self-portrait', 'Stella McCartney',
        '施华洛世奇', '泰格豪雅', 'Theory', 'Tiffany & Co.', 'TOM FORD', 'TORY BURCH', '帝舵表',
        'TUMI', 'Valentino', 'Valextra', 'VENINI', 'VICTORINOX', 'VILEBREQUIN', '沃爾福特', 'Zegna', 'ZARA'
    ],
    'Beauty, Skincare, Fragrance & Wellness': [
        'Armani Beauty', 'Aesop', 'BEYORG有機無限', 'Bobbi Brown', 'CHANEL BEAUTÉ', 'Clé de Peau Beauté', 'Dior Beauty',
        'Diptyque', 'EX NIHILO', 'GROWN ALCHEMIST', 'Jo Malone London', 'Kiehl’s Since 1851', 'La Maison VALMONT',
        'la prairie', 'Le Labo', 'LUSH', 'Maison Margiela 馬吉拉香氛', '(MALIN+GOETZ)', 'Miu Miu Beauty',
        'my NAIL NAIL', 'Marie France Van Damme', 'CREED', 'PRIVATE i SALON', 'RITUALS', 'SKIN LAUNDRY', '資生堂', '雪花秀', 'YSL BEAUTÉ', 'NARS'
    ],
    'Food & Beverage': [
        '% Arabica', '4口', 'Blue Bottle Coffee', 'CaN LaH', '唐述', 'COVA PASTICCERIA & CONFETTERIA', 'DALLOYAU',
        'Dedica Restaurant Lounge & Bar', '國金軒', 'Flat Iron Steak', 'Fuel Espresso', 'GODIVA Chocolatier',
        'Jiang Nan by Crystal Jade 江南 · 翡翠', 'Kapok', 'KiKi麵店（KiKi茶）', '金色不如帰', 'La Famille',
        'La Maison du Chocolat', 'LA RAMBLA by Catalunya', 'Lady M New York', 'LE SALON DE THÉ de Joël Robuchon',
        '利苑酒家', 'LIFETASTIC Patisserie', 'Luneurs', 'McDonald’s & McCafe', 'McHugs', '米炊', 'nodi',
        'OMOTESANDO KOFFEE', 'OMUSUBI', 'PALACE ifc', 'Pata Negra House', 'Paul Lafayet', 'PIERRE MARCOLINI',
        'Pierre Hermé Paris', 'POME', 'Pret A Manger', 'Royal Caviar Club', 'Sabatini Ristorante Italiano',
        'SABATINI 意大利餐廳', 'SBAKERY BY MAMA SOO', 'Shake Shack', '千両', '四季菊', 'Starbucks Coffee',
        'Tea WG', 'The Cakery x maya', '正斗粥麵專家', 'Tonkichi - 日式吉列專門店', 'TruffleBAKERY', 'Venchi',
        '挽肉と米', 'YOKU MOKU', 'YO MAMA'
    ],
    'Gourmet Food & Specialty Drinks': [
        '夿萐咖啡', '吃茶三千', 'city’super', 'ENOTECA', '福茗堂茶莊', 'Hole Foods', '奇華餅家', '至醇酒庫',
        'Milkfill', 'The Whisky Library', '屈臣氏酒窖', 'Nespresso'
    ],
    'Lifestyle, Books, Electronics & Services': [
        'Apple Store', 'Bang & Olufsen', 'Bookazine', '布克兄弟', 'chapter', 'DEVIALET', 'dyson', 'flannel flowers',
        '徠卡', '亮視點', 'Mannings Plus', 'Moleskine', 'moodytiger', 'The New Black Optical', 'PIN',
        'PURE Fitness', 'Sheer', 'Simply Toys', 'SmarTone', 'sunglass hut', 'Wedgwood'
    ],
    'Department Stores & Large Multi-Brand Retailers': [
        '連卡佛', 'Sephora'
    ],
}

LABEL_TO_CATEGORY = {}
for category, labels in CATEGORY_MAP.items():
    for label in labels:
        LABEL_TO_CATEGORY[label.lower()] = category


def assign_categories(graph_path):
    with open(graph_path, 'r', encoding='utf-8') as f:
        graph = json.load(f)

    unmatched = []
    updated = 0
    for node in graph.get('nodes', []):
        if node.get('type') != 'shop':
            continue

        category = LABEL_TO_CATEGORY.get(node['label'].lower())
        if category:
            if node.get('category') != category:
                node['category'] = category
                updated += 1
        else:
            unmatched.append((node['id'], node['label'], node.get('code')))

    if unmatched:
        print('WARNING: Some shop nodes were not matched to a category:')
        for node_id, label, code in unmatched:
            print(f'  - {label} ({code}) id={node_id}')
    else:
        print('All shop nodes were successfully assigned categories.')

    with open(graph_path, 'w', encoding='utf-8') as f:
        json.dump(graph, f, ensure_ascii=False, indent=2)

    print(f'Updated category metadata for {updated} shop nodes.')  


if __name__ == '__main__':
    import os
    graph_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'graph.json')
    assign_categories(graph_path)
