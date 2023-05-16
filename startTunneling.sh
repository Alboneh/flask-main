#!/bin/bash



#start tunneling to expose localhost to domain
cloudflared tunnel run --config ./config.yml
