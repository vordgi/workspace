# Workspace

Пакет для взаимодействия с экосистемой gitlab + jira посредством консоли.

### Использование утилиты
```bash
$ wrsp -j WS-3 -m -c
```

Утилита найдет в jire задачу с ключем WS-3 (```-j WS-3```), создаст в гитлабе merge с описанием по задаче (```-m```) и создаст коммент со ссылкой на мердж в задаче в jira (```-c```). Подробнее про данный и другой функционал в разделе **опции и команды**.

### Установка

С помощью NPM:
```bash
$ npm install wrsp -g
```

### Конфигурация утилиты

```bash
$ wrsp c
```

После ввода команды в консоли нужно будет поочередно указать:
1. Jira email - email от jira (необходимо для взаимодействия с jira api)
1. Jira workspace name - ключ от jira (напр. для https://workspace.atlassian.net/ - **workspace**)
1. Jira token - token от jira api [[офиц. инструкция](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)]
1. Private gitlab token - token от gitlab с доступами: ```api``` и ```read_api``` [[офиц. инструкция](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)]
1. Затем вы можете добавлять/редактировать и удалять gitlab проекты, с которыми планируете взаимодействовать посредством утилиты
    1. Если проекты уже есть, то вы можете выбрать из вариантов: continue, update, remove
    1. Add project (N) - (y/N) Если проекты еще не добавлены или нужно добавить еще один проект то вы можете добавить проект или завершить конфигурацию. Добавление проекта:
        * Gitlab project full name - полное имя проекта для утилиты (напр. **workspace**)
        * Gitlab project short name - короткое имя проекта (напр. **w**)
        * Gitlab project id - id проекта
        * Gitlab project is default - будет ли проект использоваться по умолчанию (без специальной опции)

Также конфигурационный файл можно хранить отдельно в папке, из которой вы вызываете утилиту. Файл должен называться ```workspace.config.json```.

Пример конфигурационного файла:

## Опции и команды

В утилиту добавлены несколько команд, для каждой команды свои опции

```bash
wrsp -h
```
```txt
'--help', '-h' {Boolean} - help - view commands and args
'report' {Boolean} - get reports
'configure', 'c' {Boolean} - configure workspace
'work' {Boolean} - work with tasks in jira and git
```

### wrsp work

Команда используется по умолчания, указывать не обязательно.

```bash
wrsp work -h
```
```txt
'--jira-task', '-j' {String} - name of current task into jira (for ex NT-2020)
'--source-branch', '-s' {String} - source branch (by default equal with --jira-task oprion)
'--target-branch', '-t' {String} - target branch (default - "master")
'--project', '-p' {String} - full or short name of giltab project (make sure, that you add them into config)
'--merge', '-m' {Boolean} - use if you want create merge for task in gitlab
'--comment', '-c' {Boolean} - use if you want create comment with link to current mr (only with -m flag)
'--help', '-h' {Boolean} - help
```

#### Примеры использования:

*Проект по умолчанию* - `workspace`

```bash
wrsp -j WS-1 -m -t WS-1 -s WS-1_fix -c
```
Утилита создаст мердж (`-m`) из ветки с ключем WS-1_fix (`-s WS-1_fix`) в ветку WS-1 (`-t WS-1`), описание к мерджу построится на основе задачи из jira с ключем WS-1 (`-j WS-1`). В задачу в jira добавится комментарий со ссылкой на merge (`-c`).

```bash
wrsp -j WS-1 -m -t main
```
Утилита создаст мердж (`-m`) из ветки с ключем WS-1 (`-j WS-1`) в ветку main (`-t main`), описание к мерджу построится на основе задачи из jira с ключем WS-1 (`-j WS-1`).

```bash
wrsp -j WS-1 -m -t main
```
Утилита создаст мердж (`-m`) из ветки с ключем WS-1 (`-j WS-1`) в ветку main (`-t main`), описание к мерджу построится на основе задачи из jira с ключем WS-1 (`-j WS-1`).

```bash
wrsp -j NG-1 -p ng
```
Утилита выведет в консоль ссылку на задачу в jira и список merge request-ов у которых в качестве source branch указана ветка WS-1 (`-j NG-1`, *опция `--source-brance` по умолчанию равна опции `-j`*) для проекта, у которого в качестве краткого имени указано ng (`-p ng`, *см. раздел конфигурации*).

### wrsp report

Команда для получения отчетов.

```bash
wrsp report -h
```
```txt
'--variant', '-v' {String} - list | points
'--write', '-w' {Boolean} - write file in current folder instead logging.
'--help', '-h' {Boolean} - help
```

Доступные варианты:
`list` - список выполненных задач (со статусом resolved) за последний месяц (по 23 число)
`points` - Количество стори поинтов в определенный период времени. (*Вариант в разработке*)

По умолчанию список задач логится в консиоль. При использовании опции `-w` - в папке, из которой вызвана утилита будет создан файл `report.txt`

## Лицензия
Workspace предоставляется в соответствии с условиями лицензии MIT.
