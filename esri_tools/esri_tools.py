import os
from arcgis.gis import GIS
import sys

def get_webmap_id(map_postfix,environment,username,password):
    gis = GIS(username=username, password=password)
    webmap_name = "dynrem-" + environment + "-" + map_postfix
    webmap_list = gis.content.search(webmap_name, item_type="Web Map")
    if len(webmap_list) > 0:
        return webmap_list[0].id
    return ''

if __name__ == '__main__':
    print(get_webmap_id("safety-map"))
