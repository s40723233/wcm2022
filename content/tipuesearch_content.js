var tipuesearch = {"pages": [{'title': 'About', 'text': '此內容管理系統以\xa0 https://github.com/mdecourse/cmsimde \xa0作為 submodule 運作, 可以選定對應的版本運作, cmsimde 可以持續改版, 不會影響之前設為 submodule, 使用舊版 cmsimde 模組的內容管理相關運作1 \n 利用 cmsimde 建立靜態網誌方法: \n 1. 在 github 建立倉儲, git clone 到近端 \n 2. 參考\xa0 https://github.com/mdecourse/newcms , 加入除了 cmsimde 目錄外的所有內容 \n 以 git submodule add\xa0 https://github.com/mdecourse/cmsimde \xa0cmsimde \n 建立 cmsimde 目錄, 並從 github 取下子模組內容. \n 3.在近端維護時, 更換目錄到倉儲中的 cmsimde, 以 python wsgi.py 啟動近端網際伺服器. \n 動態內容編輯完成後, 以 generate_pages 轉為靜態內容, 以 git add commit 及 push 將內容推到遠端. \n 4. 之後若要以 git clone 取下包含 submodule 的所有內容, 執行: \n git clone --recurse-submodules  https://github.com/mdecourse/newcms.git \n', 'tags': '', 'url': 'About.html'}, {'title': 'Week1~9', 'text': '\n # from https://levelup.gitconnected.com/writing-tetris-in-python-2a16bddb5318\n# 暫時關閉 system proxy 設定後,  pip install pygame\n#import pygame\nimport random\n# 以下為 Brython 新增\nfrom browser import document as doc\nfrom browser import html\nimport browser.timer\n\n# 利用 html 建立一個 CANVAS 標註物件, 與變數 canvas 對應\ncanvas = html.CANVAS(width = 400, height = 500, id="canvas")\nbrython_div = doc["brython_div"]\nbrython_div <= canvas\nctx = canvas.getContext("2d")\n\ncolors = [\n    (0, 0, 0),\n    (120, 37, 179),\n    (100, 179, 179),\n    (80, 34, 22),\n    (80, 134, 22),\n    (180, 34, 22),\n    (180, 34, 122),\n]\n\n\nclass Figure:\n    x = 0\n    y = 0\n\n    figures = [\n        [[1, 5, 9, 13], [4, 5, 6, 7]],\n        [[4, 5, 9, 10], [2, 6, 5, 9]],\n        [[6, 7, 9, 10], [1, 5, 6, 10]],\n        [[1, 2, 5, 9], [0, 4, 5, 6], [1, 5, 9, 8], [4, 5, 6, 10]],\n        [[1, 2, 6, 10], [5, 6, 7, 9], [2, 6, 10, 11], [3, 5, 6, 7]],\n        [[1, 4, 5, 6], [1, 4, 5, 9], [4, 5, 6, 9], [1, 5, 6, 9]],\n        [[1, 2, 5, 6]],\n    ]\n\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n        self.type = random.randint(0, len(self.figures) - 1)\n        self.color = random.randint(1, len(colors) - 1)\n        self.rotation = 0\n\n    def image(self):\n        return self.figures[self.type][self.rotation]\n\n    def rotate(self):\n        self.rotation = (self.rotation + 1) % len(self.figures[self.type])\n    \n    def rotate1(self):\n        self.rotation = (self.rotation - 1) % len(self.figures[self.type])\n\nclass Tetris:\n    level = 2\n    score = 0\n    state = "start"\n    field = []\n    height = 0\n    width = 0\n    x = 100\n    y = 60\n    zoom = 20\n    figure = None\n\n    def __init__(self, height, width):\n        self.height = height\n        self.width = width\n        self.field = []\n        self.score = 0\n        self.state = "start"\n        for i in range(height):\n            new_line = []\n            for j in range(width):\n                # 起始時每一個都填入 0\n                new_line.append(0)\n            self.field.append(new_line)\n\n    def new_figure(self):\n        self.figure = Figure(3, 0)\n\n    def intersects(self):\n        intersection = False\n        for i in range(4):\n            for j in range(4):\n                if i * 4 + j in self.figure.image():\n                    # block 到達底部, 左右兩邊界, 或該座標有其他 block\n                    if i + self.figure.y > self.height - 1 or \\\n                            j + self.figure.x > self.width - 1 or \\\n                            j + self.figure.x < 0 or \\\n                            self.field[i + self.figure.y][j + self.figure.x] > 0:\n                        intersection = True\n        return intersection\n\n    def break_lines(self):\n        lines = 0\n        for i in range(1, self.height):\n            zeros = 0\n            for j in range(self.width):\n                if self.field[i][j] == 0:\n                    zeros += 1\n            if zeros == 0:\n                lines += 1\n                for i1 in range(i, 1, -1):\n                    for j in range(self.width):\n                        self.field[i1][j] = self.field[i1 - 1][j]\n        self.score += lines ** 2\n\n    def go_space(self):\n        while not self.intersects():\n            self.figure.y += 1\n        self.figure.y -= 1\n        self.freeze()\n\n    def go_down(self):\n        self.figure.y += 1\n        if self.intersects():\n            self.figure.y -= 1\n            self.freeze()\n\n    def freeze(self):\n        for i in range(4):\n            for j in range(4):\n                if i * 4 + j in self.figure.image():\n                    self.field[i + self.figure.y][j + self.figure.x] = self.figure.color\n        self.break_lines()\n        self.new_figure()\n        if self.intersects():\n            self.state = "gameover"\n\n    def go_side(self, dx):\n        old_x = self.figure.x\n        self.figure.x += dx\n        if self.intersects():\n            self.figure.x = old_x\n\n    def rotate(self):\n        old_rotation = self.figure.rotation\n        self.figure.rotate()\n        if self.intersects():\n            self.figure.rotation = old_rotation\n            \n    def rotate1(self):\n        old_rotation = self.figure.rotation\n        self.figure.rotate1()\n        if self.intersects():\n            self.figure.rotation = old_rotation\n\n# Define some colors\n# from https://stackoverflow.com/questions/3380726/converting-a-rgb-color-tuple-to-a-six-digit-code\nBLACK = \'#%02x%02x%02x\' % (0, 0, 0)\nWHITE = \'#%02x%02x%02x\' % (255, 255, 255)\nGRAY = \'#%02x%02x%02x\' % (128, 128, 128)\n\ndone = False\nfps = 60\ngame = Tetris(20, 10)\ncounter = 0\n\npressing_down = False\n\ndef key_down(eve):\n    key = eve.keyCode\n    #if event.type == pygame.QUIT:\n    # 32 is pause\n    if key == 32:\n        done = True\n    # 88 is x key to clockwise rotate\n    if key == 88:\n        game.rotate1()\n    # 90 is z key to anticlockwise rotate\n    if key == 90:\n        game.rotate()\n    # 67 is c key to drop -1 on the y-axis\n    if key == 67:\n        game.go_down()\n    # 40 is down key\n    if key == 40:\n        pressing_down = True\n    # 37 is left key\n    if key == 37:\n        game.go_side(-1)\n    # 39 is right key\n    if key == 39:\n        game.go_side(1)\n    # 32 is space key to move block to bottom\n    if key == 32:\n        game.go_space()\n    # 27 is escape\n    # reset the game\n    if key == 27:\n        game.__init__(20, 10)\n\ndef key_up(eve):\n    key = eve.keyCode\n    # 40 is down key\n    if key == 40:\n        pressing_down = False\n\n#while not done:\ndef do_game():\n    global counter\n    if game.figure is None:\n        game.new_figure()\n    counter += 1\n    if counter > 100000:\n        counter = 0\n    if counter % (fps // game.level // 2) == 0 or pressing_down:\n        if game.state == "start":\n            game.go_down()\n    \n    for i in range(game.height):\n        for j in range(game.width):\n            ctx.fillStyle = WHITE\n            #ctx.scale(game.zoom, game.zoom)\n            ctx.fillRect(game.x + game.zoom * j, game.y + game.zoom * i, game.zoom, game.zoom)\n            if game.field[i][j] > 0:\n                ctx.fillStyle = \'#%02x%02x%02x\' % colors[game.field[i][j]]\n                ctx.fillRect(game.x + game.zoom * j + 1, game.y + game.zoom * i + 1, game.zoom - 2, game.zoom - 1)\n            ctx.lineWidth = 1\n            ctx.strokeStyle = GRAY\n            ctx.beginPath()\n            ctx.rect(game.x + game.zoom * j, game.y + game.zoom * i, game.zoom, game.zoom)\n            ctx.stroke()\n    if game.figure is not None:\n        for i in range(4):\n            for j in range(4):\n                p = i * 4 + j\n                if p in game.figure.image():\n                    ctx.fillStyle = \'#%02x%02x%02x\' % colors[game.figure.color]\n                    ctx.fillRect(game.x + game.zoom * (j + game.figure.x) + 1,\n                                      game.y + game.zoom * (i + game.figure.y) + 1,\n                                      game.zoom - 2, game.zoom - 2)\n\ndoc.addEventListener("keydown", key_down)\ndoc.addEventListener("keyup", key_up)\nbrowser.timer.set_interval(do_game, fps) \n IPV6設定 \n 利用 \xa0 Wink \xa0 建立電腦操作流程影片時, 必須注意: \n \n 可以與 ShareX 共用 \xa0 ffmpeg.exe . \n 為了讓影片能在手機觀看, video 標註中必須帶有 autoplay 與 controls 屬性. \n video 標註的大小必須與 \xa0 Wink \xa0 專案檔中的設定相符, 合適的尺寸大小: width="1008" height="630". \n 以下 \xa0 Wink \xa0 影片設定超文件檔案: \xa0 wink_script_and_setup.txt \n \n \n \n 建立新倉儲以及設定SSH資料 \n \n', 'tags': '', 'url': 'Week1~9.html'}, {'title': 'W13', 'text': 'w13作業 \n \n \n', 'tags': '', 'url': 'W13.html'}, {'title': 'W14', 'text': '\n \n \n \n \n \n \n \n  Cango 程式庫  \n \n \n \n \n \n \n \n \n  for Konva 程式庫  \n \n \n \n \n  導入 FileSaver 與 filereader  \n \n \n \n \n  導入 ace  \n \n \n \n \n \n \n  請注意, 這裡使用 Javascript 將 localStorage["py_src"] 中存在近端瀏覽器的程式碼, 由使用者決定存檔名稱 \n \n \n \n \n  ######################  editor1 開始 ######################  \n  用來顯示程式碼的 editor 區域  \n \n  以下的表單與按鈕與前面的 Javascript doSave 函式以及 FileSaver.min.js 互相配合  \n  存擋表單開始  \n Filename:  .py   \n  存擋表單結束  \n \n  執行與清除按鈕開始  \n Run   Output   清除輸出區 清除繪圖區 Reload \n  執行與清除按鈕結束  \n \n  程式執行 ouput 區  \n \n  Brython 程式執行的結果, 都以 brython_div 作為切入位置  \n  這裡的畫布 id 為 brython_div  \n \n  graphics-column is for ggame  \n \n  ######################  editor1 結束 ######################  \n  以下可以開始利用 editor1 的設定編寫對應 Brython 程式  \n \n  以上為內建程式, 頁面可透過 ?src=gist_url 執行  \n  <script src="./../cmsimde/static/chimper/js/jquery-3.3.1.min.js"></script>  \n \n \n \n \n \n \n \n \n \n \n \n            <script src="./../cmsimde/static/chimper/js/typed.js"></script>\n                    <script>\n                    var typed = new Typed(\'.typed-words\', {\n                    strings: ["Web Apps"," WordPress"," Mobile Apps"],\n                    typeSpeed: 80,\n                    backSpeed: 80,\n                    backDelay: 4000,\n                    startDelay: 1000,\n                    loop: true,\n                    showCursor: true\n                    });\n                    </script>\n             \n \n  啟用 LaTeX equations 編輯  \n \n  <script>\n  MathJax = {\n    tex: {inlineMath: [[\'$\', \'$\'], [\'\\(\', \'\\)\']]}\n  };\n  </script>\n  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script> \n \n', 'tags': '', 'url': 'W14.html'}, {'title': '設定 nginx', 'text': 'Nginx 設定為 WWW 網際下載主機: \n nginx.conf \n \n \n \n \n \n \n 1 \n 2 \n 3 \n 4 \n 5 \n 6 \n 7 \n 8 \n 9 \n 10 \n 11 \n 12 \n 13 \n 14 \n 15 \n 16 \n 17 \n 18 \n 19 \n 20 \n 21 \n 22 \n \n \n \n server { \n \xa0\xa0\xa0\xa0 # 原先可以接受 IPv4 網路連線, 目前覆蓋為 comment \n \xa0\xa0\xa0\xa0 #listen\xa0\xa0\xa0\xa0\xa0\xa0 80; \n \xa0\xa0\xa0\xa0 # 設定接受 IPv6 網路連線 \n \xa0\xa0\xa0\xa0 listen [::]:80; \n \xa0\xa0\xa0\xa0 # 原先採 localhost 伺服器連線, 目前覆蓋為註解 \n \xa0\xa0\xa0\xa0 #server_name\xa0 localhost; \n \xa0\xa0\xa0\xa0 # 只允許系上 IPv6 網路連線 \n \xa0\xa0\xa0\xa0 allow 2001:288:6004:17::0/32; \n \xa0\xa0\xa0\xa0 # 除系上網段外, 其餘網段均拒絕連線 \n \xa0\xa0\xa0\xa0 deny all; \n \xa0\xa0\xa0\xa0 \xa0 \n \xa0\xa0\xa0\xa0 location / { \n \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 # 網際根目錄 \n \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 root E:/downloads; \n \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 # 利用帳號密碼認證後才可連線 \n \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 auth_basic  "For Authorized Users Only!" ; \n \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 auth_basic_user_file C:/pj2022/nginx-1.20.2/.htpasswd;  \n \xa0\xa0\xa0\xa0 } \n \xa0\xa0\xa0\xa0 # 設定為列出各檔案與目錄的索引內容 \n \xa0\xa0\xa0\xa0 autoindex on; \n } \n \n \n \n \n \n \n \n \n  接下來將 mp4 檔案從 downloads 目錄取出  \n \n \n \n   \n \n \n \n \n \n \n \n \n', 'tags': '', 'url': '設定 nginx.html'}, {'title': '查驗 nginx 數位簽章', 'text': '<script>// <![CDATA[ var winkVideoData = {  dataVersion: 1,  frameRate: 10,  buttonFrameLength: 5,  buttonFrameOffset: 2,  frameStops: {  }, }; // ]]></script> <!-- 接下來將 mp4 檔案從 downloads 目錄取出 --> <div class="winkVideoContainerClass"><video width="1008" height="630" autoplay="autoplay" class="winkVideoClass" controls="controls" data-dirname="./../cmsimde/static" data-varname="winkVideoData" muted="true"> <source src="./../downloads/nginx.mp4" type="video/mp4" /></video> <div class="winkVideoOverlayClass"></div> <div class="winkVideoControlBarClass"><button class="winkVideoControlBarPlayButtonClass"></button> <button class="winkVideoControlBarPauseButtonClass"></button> <div class="winkVideoControlBarProgressLeftClass"></div> <div class="winkVideoControlBarProgressEmptyMiddleClass"></div> <div class="winkVideoControlBarProgressRightClass"></div> <div class="winkVideoControlBarProgressFilledMiddleClass"></div> <div class="winkVideoControlBarProgressThumbClass"></div> </div> <div class="winkVideoPlayOverlayClass"></div> </div> \n', 'tags': '', 'url': '查驗 nginx 數位簽章.html'}, {'title': 'Develop', 'text': 'https://github.com/mdecourse/cmsimde \xa0的開發, 可以在一個目錄中放入 cmsimde, 然後將 up_dir 中的內容放到與 cmsimde 目錄同位階的地方, 使用 command 進入 cmsimde 目錄, 執行 python wsgi.py, 就可以啟動, 以瀏覽器 https://localhost:9443\xa0就可以連接, 以 admin 作為管理者密碼, 就可以登入維護內容. \n cmsimde 的開發採用 Leo Editor, 開啟 cmsimde 目錄中的 cmsimde.leo 就可以進行程式修改, 結束後, 若要保留網際內容, 只要將 cmsimde 外部的內容倒回 up_dir 目錄中即可後續對 cmsimde 遠端倉儲進行改版. \n init.py 位於\xa0 up_dir 目錄, 可以設定 site_title 與 uwsgi 等變數.', 'tags': '', 'url': 'Develop.html'}]};