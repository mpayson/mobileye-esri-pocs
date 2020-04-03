import unittest
import time
import os
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome import options
import HtmlTestRunner


class TestCases(unittest.TestCase):

    # Chrome Browser Setup
    def setUp(self):
        self.environment = os.environ.get("ENVIRONMENT", "ci")
        self.username = os.environ.get("USERNAME", "user")
        self.password = os.environ.get("PASSWORD", "pass")

        opt = options.Options()
        opt.add_argument("--headless")
        opt.add_argument("--no-sandbox")
        opt.add_argument("--disable-dev-shm-usage")
        if os.name == "nt":
            print("[this is Windows] ")
            self.driver = webdriver.Chrome('chromedriver.exe')
        else:
            print("[running on linux Jenkins slave] ")
            self.driver = webdriver.Chrome('/usr/bin/chromedriver', chrome_options=opt)

    def get_driver(self):
        page_url = f"http://webmaps-{self.environment}.dynamic-geo-insights-preprod.com/#/events"
        driver = self.driver
        driver.maximize_window()

        timeout = 10
        try:
            driver.get(page_url)
            driver.save_screenshot("_00_main_login_page.png")
            li = driver.find_element_by_class_name('login-btn')
            li.click()  # clicked login
            time.sleep(timeout) # wait
            driver.switch_to.window(driver.window_handles[1])
            driver.save_screenshot("_05_before_credentials.png")
            user = driver.find_element_by_id('user_username')
            user.send_keys(self.username)
            pwd = driver.find_element_by_id('user_password')
            pwd.send_keys(self.password)
            driver.save_screenshot("_10_after_credentials.png")
            si = driver.find_element_by_id("signIn")
            si.click()
            time.sleep(timeout)
            driver.switch_to.window(driver.window_handles[0])
            driver.save_screenshot("_15_map.png")
            time.sleep(10)
        except TimeoutException:
            print("Timed out waiting for the page to load.")

        return driver

    def test_map_exists(self):
        driver = self.get_driver()
        try:
            memap = driver.find_element_by_class_name('esri-ui')
            assert memap.is_displayed()
            print("Map is Visible!")
        except TimeoutException:
            driver.save_screenshot("_nomap.png")
            print("Map is not visible!")

        try:
            me_menu = driver.find_element_by_class_name("esri-legend--card__carousel-indicator")
            me_menu.click()
            driver.save_screenshot("_30_menu.png")
            time.sleep(10)
            zo = driver.find_element_by_xpath('//*[@id="root"]/section/section/main/div/div/div[2]/div[1]/div[3]/div[1]/div[3]/div/div[2]')
            zo.click()
            time.sleep(10)
            zo.click()
            time.sleep(10)
            driver.save_screenshot("_32_zoom_out_clicked.png")
            pedestrians = driver.find_element_by_xpath('//*[@id="ped_cycl"]')
            pedestrians.click()
            time.sleep(10)
            driver.save_screenshot("_34_menu_pedestrians_disabled.png")
            print("Slider is clickable!")
        except TimeoutException:
            driver.save_screenshot("_nomenu.png")
            print("Slider is not clickable!")

    # Closing the browser.
    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    htmlTestRunner = HtmlTestRunner.HTMLTestRunner(output="report")
    unittest.main(testRunner=htmlTestRunner)
