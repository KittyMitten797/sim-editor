class vWindow {
	constructor()
	{
		this.next = 0;
		this.vObjs = new Array();
		this.windowObjs = new Array();
	}
	checkReady(idx=0 )
	{
		var win = this.windowObjs[idx];
	}
	openWindow(width, height, filename)
	{
		this.next++;
		var idx = this.next;
		var winName = "ChildWindow"+this.next;
		var win = window.open("test4.php?filename="+filename,winName, "location=0,status=0,scrollbars=0,width="+width+",height="+height);
					
		this.windowObjs[idx] = win;
		return ( idx );
	}
	connectVideo(idx=0)
	{
		var win = this.windowObjs[idx];
		win.document.getElementById('target').innerHTML = 'Connected!';
		this.vObjs[idx] = this.windowObjs[idx].document.getElementsByClassName('videoPlayer');
	}
	play(idx=0 )
	{
		if ( idx == 0 )
		{
			this.vObjs.forEach (function(obj)
			{
				obj[0].play();
			});
		}
		else
		{
			this.vObjs[idx][0].play();
		}
	}
	pause(idx=0 )
	{
		if ( idx == 0 )
		{
			this.vObjs.forEach (function(obj)
			{
				obj[0].pause();
			});
		}
		else
		{
			this.vObjs[idx][0].pause();
		}
	}

	seek(time=0, idx=0 )
	{
		if ( idx == 0 )
		{
			this.vObjs.forEach (function(obj)
			{
				obj[0].currentTime = time;
			});
		}
		else
		{
			this.vObjs[idx][0].currentTime = time;
		}
	}

	pause_toggle(idx=0 )
	{
		if ( idx == 0 )
		{
			this.vObjs.forEach (function(obj)
			{
				if ( obj[0].paused === true )
				{
					obj[0].play();
				}
				else
				{
					obj[0].pause();
				}
			});			
		}
		else
		{
			if ( this.vObjs[idx][0].paused === true )
			{
				this.vObjs[idx][0].play();
			}
			else
			{
				this.vObjs[idx][0].pause();
			}
		}
	}

	mute_toggle(idx=0 )
	{
		if ( idx == 0 )
		{
			this.vObjs.forEach (function(obj)
			{
				if(obj[0].muted === true) {
					obj[0].muted = false;
				} else {
					obj[0].muted = true;
				}
			});
		}
		else
		{
			if(this.vObjs[idx][0].muted === true) {
				this.vObjs[idx][0].muted = false;
			} else {
				this.vObjs[idx][0].muted = true;
			}
		}
	}
}