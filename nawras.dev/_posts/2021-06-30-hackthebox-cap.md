---
layout: post
title:  "HackTheBox: Cap"
description: Write up and complete walkthrough of HackTheBox's Cap
---

**Overview**

Cap was an Easy Linux Machine that required the attacker to analyze a `.pcap` file found on a webpage, in order to find credentials to the base user. From there, the PE vector was spawning a bash shell by using a `python -c` command and setting the process's uid to the root's uid.

## Enumeration: Initial Scan

```terminal
Nmap scan report for 10.10.10.245
Host is up (0.097s latency).
Not shown: 997 closed ports
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 fa:80:a9:b2:ca:3b:88:69:a4:28:9e:39:0d:27:d5:75 (RSA)
|   256 96:d8:f8:e3:e8:f7:71:36:c5:49:d5:9d:b6:a4:c9:0c (ECDSA)
|_  256 3f:d0:ff:91:eb:3b:f6:e1:9f:2e:8d:de:b3:de:b2:18 (ED25519)
80/tcp open  http    gunicorn
```

We can see here that: 

- Port 80 is open and running gunicorn
- Port 21 open and running **FTP**
- Port 22 open and running ssh

## Web Server

Going onto `10.10.10.245` will serve a dashboard with a colorlib theme presenting some login attempts and security events, etc.

We are by default signed in with the `Nathan` user. We can also see that none of the settings under the user's profile dropdown lead us anywhere. There is a navigation panel on the left with some links that point us to specific areas.

First and foremost, let's have a look at the panel on the left. The dashboard section does not seem that interesting. The _Security Snapshot_ section looks interesting, it's important to also note that we get a url with a parameter `/data/2`. It seems like the purpose of this functionality is to show us a snapshot of the packets sent and received by the application within a period of time. The `download` button will allow us to download a `.pcap` file, which we can analyze through an application like `Wireshark`. In this case however, it would seem like it's empty.

Let's try to poke around the url.

```
http://10.10.10.245/data/0
```

If we have a look at a different number, we can see that we can another snapshot, however, this time we have some information. Let's have a look at the `.pcap` file and check out which packets are being transferred.

## .pcap and Wireshark

Once on wireshark, we can filter the protocol of each packet and we will see that some of the packets were using FTP. We saw initially through `nmap` that FTP was also open on port 21, therefore this should not be surprise. Furthermore, what shouldn't be a surprise as well is that the service was FTP indeed and not SFTP, meaning that credentials are also available for us to see, as we can see in the screenshot:

![Untitled](/assets/20210630161107.png)

Great! This means we have a user!

- Username: `nathan`
- Pass: `Buck3tH4TF0RM3!`

We can try to ssh into the user, since we know from the initial scan that ssh was also running on the box.

```bash
$ ssh nathan@10.10.10.245
```

And we have a shell! The user's password is in the `user.txt` file: `5bbfa599c0ef28cf7e168e598de7badc`.

## Priv Esc

Now onto the root flag. This part took a bit longer than anticipated, notably because of the amount of rabbit holes that the box provides. Initially, I spent a couple of hours trying to find a vulnerability in the flask webserver, because of the subtle comments that were left on the `app.py` script found in `/var/www/html/`. The use of `global` variables and `os.system` with injectable parameters seemed to be the way to go (as you can maybe tell through the script in the annex). This method was definitly not the case. Indeed the root flag ended up being a lot easier than anticipated. Looking at the webserver script was the correct approach, however I was looking at the wrong things. The injectable parameter was not the solution, but rather the idea that the python3 command was executable by any user through Linux **Cap**abilities (Double entendre for the name of the box as well). If we look at this line of the webserver script:

```python
# permissions issues with gunicorn and threads. hacky solution for now.
#os.setuid(0)
#command = f"timeout 5 tcpdump -w {path} -i any host {ip}"
command = f"""python3 -c 'import os; os.setuid(0); os.system("timeout 5 tcpdump -w {path} -i any host {ip}")'"""
```

The solution is within the `os.setuid(0)`. The script sets its uid to the root user. We can use this method to priv esc onto root:

```bash
$ python3 -c "import os; os.setuid(0); os.system('bash')"
```

This will spawn us a root shell!

```
root@cap:/var/www/html#
```

We can then fetch the root's flag:

```
root@cap:/root# cat root.txt
0fb29fde05793258b0400602ba8d5c15
```

## Annex

**Python script running the webserver**

```python
#!/usr/bin/python3

import os
from flask import *
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import tempfile
import dpkt
from werkzeug.utils import append_slash_redirect

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = b'\x81\x02&\x18\\a0ej\x06\xec\x917y*\x04Y\x83e\xebC\xee\xab\xcf\xac;\x8dx\x8bf\xc4\x15'
limiter = Limiter(app, key_func=get_remote_address, default_limits=["99999999999999999 per day", "99999999999999999999 per hour"])
pcapid = 0
lock = False

@app.before_first_request
def get_file_id():
        global pcapid
        path = os.path.join(app.root_path, "upload")
        onlyfiles = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
        ints = []
        for x in onlyfiles:
                try:
                        ints.append(int(x.replace(".pcap", "")))
                except:
                        pass
        try:
                pcapid = max(ints)+1
        except:
                pcapid = 0


def get_appid():
        global pcapid
        return pcapid

def increment_appid():
        global pcapid
        pcapid += 1

def get_lock():
        global lock
        while lock:
                pass
        lock = True

def release_lock():
        global lock
        lock = False

def process_pcap(pcap_path):
        reader = dpkt.pcap.Reader(open(pcap_path, "rb"))
        counter=0
        ipcounter=0
        tcpcounter=0
        udpcounter=0

        for ts, pkt in reader:
                counter+=1
                eth=dpkt.ethernet.Ethernet(pkt)

                try:
                        ip=dpkt.ip.IP(eth.data)
                except:
                        continue

                ipcounter+=1

                if ip.p==0:
                        tcpcounter+=1

                if ip.p==dpkt.ip.IP_PROTO_UDP:
                        udpcounter+=1

        data = {}
        data['Number of Packets'] = counter
        data['Number of IP Packets'] = ipcounter
        data['Number of TCP Packets']  = tcpcounter
        data['Number of UDP Packets']  = udpcounter
        return data


@app.route("/")
def index():
        return render_template("index.html")

PCAP_MAGIC_BYTES = [b"\xa1\xb2\xc3\xd4", b"\xd4\xc3\xb2\xa1", b"\x0a\x0d\x0d\x0a"]

@app.route("/capture")
@limiter.limit("10 per minute")
def capture():

        get_lock()
        pcapid = get_appid()
        increment_appid()
        release_lock()

        path = os.path.join(app.root_path, "upload", str(pcapid) + ".pcap")
        ip = request.remote_addr
        # permissions issues with gunicorn and threads. hacky solution for now.
        #os.setuid(0)
        #command = f"timeout 5 tcpdump -w {path} -i any host {ip}"
        command = f"""python3 -c 'import os; os.setuid(0); os.system("timeout 5 tcpdump -w {path} -i any host {ip}")'"""
        os.system(command)
        #os.setuid(1000)

        return redirect("/data/" + str(pcapid))

@app.route("/ip")
def ifconfig():
	d = os.popen("ifconfig").read().strip()
	print(d)
	return render_template("index.html", rawtext=d)

@app.route("/netstat")
def netstat():
	d = os.popen("netstat -aneop").read().strip()
	print(d)
	return render_template("index.html", rawtext=d)

@app.route("/data")
def data():
        if "data" not in session:
                return redirect("/")
        data = session.pop("data")
        path = session.pop("path")
        return render_template("data.html", data=data, path=path)

@app.route("/data/<id>")
def data_id(id):
        try:
                id = int(id)
        except:
                return redirect("/")
        try:
                data = process_pcap(os.path.join(app.root_path, "upload", str(id) + ".pcap"))
                path = str(id) + ".pcap"
                return render_template("index.html", data=data, path=path)
        except Exception as e:
                print(e)
                return redirect("/")

@app.route("/download/<id>")
def download(id):
        try:
                id = int(id)
        except:
                return redirect("/")
        uploads = os.path.join(app.root_path, "upload")
        return send_from_directory(uploads, str(id) + ".pcap", as_attachment=True)

if __name__ == "__main__":
        app.run("0.0.0.0", 80, debug=True)

```
