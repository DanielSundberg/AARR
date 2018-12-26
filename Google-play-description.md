# YARR - Yet Another RSS Reader

## About

RSS reader for <a href="http://theoldreader.com/">The Old Reader</a>. 

When Google shut down their reader I had to find a new way to read my RSS feeds. After trying all services out there 
my pick was <a href="http://theoldreader.com/">The Old Reader</a>, probably because the service reminded me the most 
of the Google reader experience. 

Please report any feedback <a href="https://github.com/DanielSundberg/YARR/issues">on my Github page</a>.

This app is completely free and contains no ads (other than provided by RSS content providers). 
The application is provided under the MIT free software license.

## Required permissions

* Internet, we obviously need this to get the RSS feed content.

## Security

Outgoing network traffic from this app goes to <a href="https://theoldreader.com">The old reader</a> 
to fetch blog post text content. However, images, icons, videos and other resources are fetched from the RSS 
providers using standard HTML.

The application does not collect any statistics about the user, no information whatsoever is sent to 
the creator of this app.

The username and password are used to connect to TheOldReader is not saved in the application, the credentionals 
is only used to create an API key that is then used for communication with theoldreader.com. 

![Screenshot](screenshot.png)

![Screenshot](blogtext.png)
