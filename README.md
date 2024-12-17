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

> Switch: How to test a cable status?
```
How to run the test?
router # test cable-diagnos tdr int gig0/1
TDR test started on interface Gi0/1
A TDR test can take a few seconds to run on an interface
To Check the Result:
'show cable-diagnostics tdr int gig0/1' will provide the TDR results.

A Sample Run Result:
switch#sh ip int bri | i up
GigabitEthernet0/1     unassigned      YES unset  up                    up     
switch#

switch#test cable-diagnostics tdr interface gigabitEthernet 0/1
TDR test started on interface Gi0/1
A TDR test can take a few seconds to run on an interface
Use 'show cable-diagnostics tdr' to read the TDR results.

switch#
*Mar  1 01:59:05.231: %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to down

*Mar  1 01:59:06.238: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down

*Mar  1 01:59:12.772: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to up

*Mar  1 01:59:13.779: %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up

switch#


Output:
switch#show cable-diagnostics tdr interface gigabitEthernet 0/1
TDR test last run on: March 01 01:59:04

Interface Speed Local pair Pair length        Remote pair Pair status

--------- ----- ---------- ------------------ ----------- --------------------

Gi0/1     1000M Pair A     8    +/- 10 meters Pair B      Normal             

                        Pair B     8    +/- 10 meters Pair A      Normal             

                        Pair C     8    +/- 10 meters Pair D      Normal             

                        Pair D     8    +/- 10 meters Pair C      Normal             

switch#
```
