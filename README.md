# Визуализация алгоритмов

**Для запуска сайта необходимо:**

1. Открыть файл `index.html` в корне проекта с помощью `live server` из вашей IDE.
2. для работы генетического алгоритма и нейросети необходимо в соответствующих папках создать flask приложение (https://stackoverflow.com/questions/31252791/flask-importerror-no-module-named-flask) и перетащить в него исходные файлы .
3. Запустить два flask сервера с помощью командной строки вашей IDE:
   Генетический алгоритм:

`export FLASK_APP=algovslzr.py`

`flask run`

Нейронная сеть:

`export FLASK_APP=genius.py`

`export FLASK_RUN_PORT=8000`

`flask run`
