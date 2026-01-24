---
title: "Настройка xray-клиента"
description: "Дружелюбная инструкция по настройке xray-client без какого-либо предназначения"
type: docs
---

Данная инструкция поможет вам пошагово настроить клиент для работы через заданную конфигурацию соединения и особые правила маршрутизации (*routing*).

**Следуйте** каждому шагу внимательно.

> [!NOTE]
> Инструкция предназначена для настройки xray-клиента без дальнейшего предназначения – мы не предоставляем услуги прокси.

## Необходимые данные

- Строка подключения формата:

  ```
  vless://...
  ```

- Набор правил маршрутизации:

> [!WARNING]
> Данный формат правил **подходит только** для **v2rayN/v2rayNG**!
> **Для happ** правильная строка указана **в самой инструкции**.

  ```json
  [
   {"domain":["domain:ru","domain:su","domain:vk.com","domain:yandex.com"],"enabled":true,"locked":false,"outboundTag":"direct","remarks":"Domain RU - Direct"},
   {"domain":["geosite:private"],"enabled":true,"locked":false,"outboundTag":"direct","remarks":"Domain Private - Direct"},
   {"enabled":true,"ip":["geoip:ru"],"locked":false,"outboundTag":"direct","remarks":"IP RU - Direct"},
   {"enabled":true,"ip":["geoip:private"],"locked":false,"outboundTag":"direct","remarks":"IP Private - Direct"}
  ]
  ```

## Android (v2rayNG)

> [!IMPORTANT]
> NekoBox (MatsuriDayo) более не рекомендован к использованию из-за малой активности в разработке – **удалите** его.

> [!TIP]
> Наглядный пример настройки — [на видео](/videos/recipes-xray-setup-v2rayng.webm)

### Шаг 1. Установите приложение

- **Скачайте** v2rayNG с [официального репозитория](https://github.com/2dust/v2rayNG/releases).  
  Обычно нужен файл `v2rayNG_x.x.x_universal.apk`.
- **Установите** скачанный `.apk` файл на Android-устройство.

### Шаг 2. Добавьте конфигурацию

- **Откройте** приложение v2rayNG.
- **Нажмите** "+" в правом верхнем углу.
- **Выберите** `Import config from Clipboard` (предварительно **скопируйте** ссылку конфигурации в буфер обмена).

### Шаг 3. Настройте правила маршрутизации

- **Вернитесь** на главный экран приложения.
- **Нажмите** на "бургер-меню" (три полоски) в левом верхнем углу.
- **Выберите** `Routing Settings`.
- **Нажмите** на три точки в правом верхнем углу.
- **Выберите** `Import ruleset from clipboard` (предварительно **скопируйте** [JSON с правилами](#необходимые-данные)).
- **Нажмите** на Domain strategy и **выберите** `IPOnDemand`.

### Шаг 4. Запустите подключение

- **Вернитесь** на главный экран.
- **Нажмите** кнопку ▶ для запуска соединения.

## Windows / MacOS / Linux (v2rayN)

### Шаг 1. Установите приложение

- **Скачайте** нужную версию приложения с [официального репозитория](https://github.com/2dust/v2rayN/releases):
  - Windows: `v2rayN-windows-64-desktop.zip`
  - Linux: `v2rayN-linux-64.zip`
  - MacOS: `v2rayN-macos-arm64.dmg`

> [!TIP]
> **Чтобы увидеть** все файлы для скачивания **нажмите** на ссылку под файлами.
>
> ![Показать все файлы для скачивания](/images/recipes-xray-setup-v2rayn-download.webp)

#### Windows

- **Распакуйте** файл `.zip` в любое удобное место.
![Контекстное меню – распаковать всё](/images/recipes-xray-setup-v2rayn-windows-unzip.webp)

- **Переместите** распакованную папку в более естественное место – 
**вырежте** папку.
![Вырезка распакованной папки](/images/recipes-xray-setup-v2rayn-windows-cut.webp)

- Затем **вставьте** в папку `Документы`.

![Вставка в папку Документы](/images/recipes-xray-setup-v2rayn-windows-paste.webp)

- В перемещённой папке **будет** лежать `v2rayN` приложение.

> [!TIP]
> **Чтобы не потерять** приложение – **отправьте** ярлык на Рабочий Стол.
>
> ![Отправить ярлык на Рабочий Стол](/images/recipes-xray-setup-v2rayn-windows-shortcut.webp)

#### Linux

Если вы **пользуетесь Linux**, я думаю, у вас достаточно знаний, чтобы **настроить всё самостоятельно**.

В этом разделе будут рассмотрены **частые проблемы** и **пути их решения**.

#### MacOS

- **Откройте** файл `.dmg` и **перетащите** приложение в папку "Программы".
- **Откройте** терминал и **выполните** команду:

  ```
  sudo xattr -cr /Applications/v2rayN.app
  ```

- После первого открытия, **Откройте** системные настройки:
  - **Выберете** пункт `Privacy & Security`
  - **Прокрутите** вниз до уведомления о блокировке "xray"
  - **Нажмите** `Allow Anyway`

### Шаг 2. Добавьте конфигурацию

- **Откройте** v2rayN.
- **Нажмите** `Configurations` в левом верхнем углу окна.
- **Выберите** `Import Share Links from clipboard (Ctrl+V)` (предварительно **скопируйте** конфигурационную ссылку).
  ![Импортирование Конфигурации](/images/recipes-xray-setup-v2rayn-import-config.webp)

### Шаг 3. Настройте правила маршрутизации

- **Перейдите** в `Settings` → `Routing Settings`.
  ![Открытие Настроек Маршрутизации](/images/recipes-xray-setup-v2rayn-open-routing.webp)
- В открывшемся окне:
  - **Нажмите** `Add` в верхнем левом углу.
  - В новом окне в поле Remarks **введите** произвольное имя, например: "RU - Direct".
  - В поле Domain strategy **выберите** `IPOnDemand`.
  - В вверху окна **нажмите** `Import Rules From Clipboard` (предварительно **скопируйте** [JSON с правилами](#необходимые-данные)).
  - В появившемся окне "Do you want to append rules? ..." – **нажмите** `No`.
    ![Импортирование Правил Маршрутизации](/images/recipes-xray-setup-v2rayn-add-routing.webp)

  - **Нажимайте** `Confirm` до тех пор, пока не **вернётесь** в основной интерфейс.

### Шаг 4. Запустите подключение

- **Выберите** созданные правила маршрутизации из второго выпадающего списка снизу.
  ![Выбор Правил Маршрутизации](/images/recipes-xray-setup-v2rayn-select-routing.webp)

- **Нажмите** `Enable Tun` для запуска соединения (**следуйте** запросам v2rayN).

## iOS / iPadOS (happ)

### Шаг 1. Установите приложение

- **Установите** _happ_ из [App Store](https://apps.apple.com/us/app/happ-proxy-utility/id6504287215).

### Шаг 2. Добавьте конфигурацию

- **Откройте** приложение.
- **Нажмите** "+" в правом верхнем углу.
- **Выберите** `Import from clipboard` (предварительно **скопируйте** ссылку конфигурации в буфер обмена).

![Добавление конфигурации](/images/recipes-xray-setup-happ-import-config.webp)

### Шаг 3. Откройте настройки роутинга

- **Перейдите** по значку шестиренки в левом верхнем углу.
- **Выберите** `Routing Rules`.

![Открытие настроек роутинга](/images/recipes-xray-setup-happ-open-routing.webp)

### Шаг 4. Импортируйте роутинг

- **Нажмите** `...` (три точки) в правом верхнем углу.
- **Выберите** `Import from clipboard` (предварительно **скопируйте** правила, см. ниже).

> [!IMPORTANT]
> Формат правил отличается от v2rayN/v2rayNG!
> Эта строка - эквивалентна правилам сверху.
>
> ```
> happ://routing/add/eyJEbnNIb3N0cyI6eyJkbnMuZ29vZ2xlIjoiOC44LjguOCIsImNsb3VkZmxhcmUtZG5zLmNvbSI6IjEuMS4xLjEifSwiQmxvY2tJcCI6W10sIkZha2VEbnMiOnRydWUsIlJlbW90ZUROU1R5cGUiOiJEb1UiLCJEb21lc3RpY0ROU0lwIjoiOC44LjguOCIsIkRpcmVjdFNpdGVzIjpbImRvbWFpbjpydSIsImRvbWFpbjpzdSIsImRvbWFpbjp2ay5jb20iLCJkb21haW46eWFuZGV4LmNvbSIsImdlb3NpdGU6cHJpdmF0ZSJdLCJHZW9pcFVybCI6Imh0dHBzOlwvXC9naXRodWIuY29tXC9Mb3lhbHNvbGRpZXJcL3YycmF5LXJ1bGVzLWRhdFwvcmVsZWFzZXNcL2xhdGVzdFwvZG93bmxvYWRcL2dlb2lwLmRhdCIsIkdsb2JhbFByb3h5Ijp0cnVlLCJEaXJlY3RJcCI6WyJnZW9pcDpydSIsImdlb2lwOnByaXZhdGUiXSwiUHJveHlTaXRlcyI6W10sIk5hbWUiOiJEZWZhdWx0IiwiR2Vvc2l0ZVVybCI6Imh0dHBzOlwvXC9naXRodWIuY29tXC9Mb3lhbHNvbGRpZXJcL3YycmF5LXJ1bGVzLWRhdFwvcmVsZWFzZXNcL2xhdGVzdFwvZG93bmxvYWRcL2dlb3NpdGUuZGF0IiwiQmxvY2tTaXRlcyI6W10sIkxhc3RVcGRhdGVkIjoxNzU5NDMxODk5LCJVc2VDaHVua0ZpbGVzIjp0cnVlLCJSZW1vdGVETlNEb21haW4iOiJodHRwczpcL1wvY2xvdWRmbGFyZS1kbnMuY29tXC9kbnMtcXVlcnkiLCJEb21haW5TdHJhdGVneSI6IklQSWZOb25NYXRjaCIsIkRvbWVzdGljRE5TRG9tYWluIjoiaHR0cHM6XC9cL2Rucy5nb29nbGVcL2Rucy1xdWVyeSIsIlJlbW90ZUROU0lwIjoiMS4xLjEuMSIsIlByb3h5SXAiOltdLCJEb21lc3RpY0ROU1R5cGUiOiJEb1UifQ==
> ```

![Импортирование правил](/images/recipes-xray-setup-happ-add-routing.webp)

### Шаг 5. Роутинг установлен

- **После** настройки роутинга,
  содержимое экрана должно быть похоже на картинку снизу.
- **Вернитесь** на главный экран.
- **Нажмите** кнопку вкключения для запуска соединения.

![Финальный экран](/images/recipes-xray-setup-happ-routing-final.webp)
