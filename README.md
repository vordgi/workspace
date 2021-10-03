# Workspace

Пакет для взаимодействия с экосистемой gitlab + jira посредством консоли.

### Использование утилиты
```bash
$ wrsp -j WS-3 -m -c
```

Утилита найдет в jire задачу с ключем WS-3 (`-j WS-3`), создаст в гитлабе MR с описанием по задаче [[подробнее](#%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B8-%D0%BA-mr)] (`-m`) и создаст коммент со ссылкой на MR в задаче jira (`-c`). Подробнее про данный и другой функционал в разделе [опции и команды](#%D0%BE%D0%BF%D1%86%D0%B8%D0%B8-%D0%B8-%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D1%8B).

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
1. Private gitlab token - token от gitlab с доступами: `api` и `read_api` [[офиц. инструкция](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)]
1. Затем вы можете добавлять/редактировать и удалять gitlab проекты, с которыми планируете взаимодействовать посредством утилиты
    1. Если проекты уже есть, то вы можете выбрать из вариантов: continue, update, remove
    1. Add project (N) - (y/N) Если проекты еще не добавлены или нужно добавить еще один проект то вы можете добавить проект или завершить конфигурацию. Добавление проекта:
        * Gitlab project full name - полное имя проекта для утилиты (напр. **workspace**)
        * Gitlab project short name - короткое имя проекта (напр. **w**)
        * Gitlab project id - id проекта
1. defaultProject - проект, который будет использоваться по умолчанию (без специальной опции).

Также конфигурационный файл можно хранить отдельно в папке, из которой вы вызываете утилиту. Файл должен называться `workspace.config.json`.

Пример конфигурационного файла:

```json
{
	"jira": {
		"email": "example@email.com",
		"name": "vordgi",
		"token": "your_jira_token"
	},
	"gitlab": {
		"token": "your_gitlab_token"
	},
	"gitlabProjects": [
		{
			"shortName": "pfn",
			"fullName": "project-full-name",
			"id": 11111111
		},
		{
			"shortName": "ws",
			"fullName": "workspace",
			"id": 99999999,
			"isDefault": true
		}
	],
	"defaultProject": "workspace"
}
```

## Опции и команды

В утилиту добавлены несколько команд, для каждой команды свои опции

```bash
wrsp -h
```
```txt
'--help', '-h' {Boolean} - help - view commands and args
'--version', '-v' {Boolean} - check package version
'configure', 'c' {Boolean} - configure workspace
'save' {Boolean} - save base configuration (workspace.base.json) globally
'work' {Boolean} - work with tasks in jira and git
'report' {Boolean} - get reports
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

#### Комментарии к MR
Для комментария в задаче должны быть указаны следующие поля:

`creator.displayName` - автор задачи

`assignee.displayName` - исполнитель задачи

`issuetype.name` - тип задачи

Сгенерированный комментарий выглядит следующим образом:

> [WS-3](https://vordgi.atlassian.net/browse/WS-3)
> 
> creator: Savelyev Alexander
> 
> assignee: Savelyev Alexander
> 
> issue type: Task

Если у вас есть вопросы и пожелания относительно комментариев - пожалуйста, оставьте обратную связь в [задаче](https://github.com/vordgi/workspace/issues/2).

#### Примеры использования:

```bash
wrsp -j WS-1
```
Утилита выведет в консоль ссылку на задачу и на merge request-ы.

```bash
wrsp -j WS-1 -m -t WS-1 -s WS-1_fix -c
```
Утилита создаст MR (`-m`) из ветки с ключем WS-1_fix (`-s WS-1_fix`) в ветку WS-1 (`-t WS-1`), описание к MR-у построится на основе задачи из jira с ключем WS-1 (`-j WS-1`). В задачу в jira добавится комментарий со ссылкой на merge (`-c`).

```bash
wrsp -j WS-1 -m -t main
```
Утилита создаст MR (`-m`) из ветки с ключем WS-1 (`-j WS-1`) в ветку main (`-t main`), описание к MR-у построится на основе задачи из jira с ключем WS-1 (`-j WS-1`).

```bash
wrsp -j NG-1 -p ng
```
Утилита выведет в консоль ссылку на задачу в jira и список merge request-ов у которых в качестве source branch указана ветка WS-1 (`-j NG-1`, *опция `--source-brance` по умолчанию равна опции `-j`*) для проекта, у которого в качестве краткого имени указано ng (`-p ng`, *см. [[конфигурация](#%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B3%D1%83%D1%80%D0%B0%D1%86%D0%B8%D1%8F-%D1%83%D1%82%D0%B8%D0%BB%D0%B8%D1%82%D1%8B)]*).

### wrsp report

Команда для получения отчетов.

```bash
wrsp report -h
```
```txt
'--variant', '-v' {String} - list | points
'--write', '-w' {Boolean} - write file in current folder instead logging.
'--start-date', '-s' {String} - start date (f.e. 2021-11-21, by default - exactly a month ago)
'--end-date', '-e' {String} - end date (f.e. 2021-12-21, by default - today date)
'--field', '-f' {String[]} - field key (f.e. ['summary', 'reporter.displayName'], by default - ['summary'])
'--help', '-h' {Boolean} - help
```

Доступные варианты:
`list` - список выполненных задач (со статусом resolved) за последний месяц
`points` - Количество стори поинтов в определенный период времени. (*Вариант в разработке*)

По умолчанию список задач логится в консиоль. При использовании опции `-w` - в папке, из которой вызвана утилита будет создан файл `report.txt`

#### Примеры использования:

```bash
wrsp report -v list
```
Утилита выведет в консоль список задач, которые были выполнены вами в последний месяц (перешли в статус resolved)

```bash
wrsp report -v list -s 2021-01-01 -e 2021-03-31 -w
```
Утилита создаст файл (`-w`) в папке, из которой были вызвана команда со списком всех задач, выполненных вами в первый квартал 2021 года (`-s 2021-01-01 -e 2021-03-31`).

```bash
wrsp report -v list -s 2021-01-01 -w
```
Утилита создаст файл (`-w`) в папке, из которой были вызвана команда со списком всех задач, выполненных вами в этом году (`-s 2021-01-01`).

```bash
wrsp report -v list -f summary -f reporter.displayName
```
Утилита выведет в консоль список выполненных вами задач в последний месяц с описанием (`-f summary`) и автором (`-f reporter.displayName`)
```bash
WRSP-43 Add start and end dates / Savelyev Alexander
WRSP-44 Add fields option / Savelyev Alexander
...
WRSP-80 Something / Collaborator Name
```

## Дополнительно
Утилита находится в стадии активной разработки. Если у вас есть пожелания или возникли трудности - пожалуйста, создавайте задачи и оставляйте комментарии в [задачах проекта](https://github.com/vordgi/workspace/issues).

## Лицензия
Workspace предоставляется в соответствии с условиями лицензии MIT.
