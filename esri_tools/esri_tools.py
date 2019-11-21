import os
from arcgis.gis import GIS
import sys

def get_webmap_id(map_postfix,environment):
    username = 'dynrem.generic'
    password = 'Dynr3mG3neric'
    gis = GIS(username=username, password=password)
    webmap_name = "dynrem-" + environment + "-" + map_postfix
    webmap_list = gis.content.search(webmap_name, item_type="Web Map")
    webmap_id = webmap_list[0].id
    return webmap_id

if __name__ == '__main__':
    print(get_webmap_id("safety-map"))
