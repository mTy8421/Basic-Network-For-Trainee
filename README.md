# Cisco Basic Cheat Sheet

> General

| Command | Description | Displays As |
|--|--|--|
|> en|Enter Privleged Exec Mode|#|
|# conf t|Enter Global Config Mode|(config) #|
|(config) # int {type} {number}|Enter Interface Config Mode|(config-if) #|
|(config) # vlan {number}|Enter VLAN Config Mode|(config-vlan) #|
|(config) # line con 0|Enter Console Line Config Mode|(config-line) #|
|(config) # line vty 0 15|Enter VTY Line Config Mode|(config-line) #|
|(config) # no ip dom lo|Stops Router Domain Lookup||
|(config) # undebug all|Stops all Debugs||
|# clock set {time} {date}|Sets manual Time/Date||
|# show file systems|Lists available file systems||
|# exit|Exits current mode/l​evel||

> House keeping

| Command | Description |
|--|--|
|(config) # ho { name }|Set name of device|
|(config) # ena sec { password }|Set encypted password for Priv Exec Mode|
|(config) # ser pass|Encrypts All Passwords|
|(config) # banner motd $ { Banner } $|Creates Message banner|
|(config) # security pass min { number }|Sets min password length|
|(config) # login block-for { time } attempts { attempts } within { time }|Login failure wait time set|
|(config-line) # pass { password }|Sets password for Console Line|
|(config-line) # login|Makes passwords active, use after every password config|
