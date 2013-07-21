CKEditor-WordCount-Plugin
=========================

WordCount Plugin for CKEditor that counts the words/characters an shows the word count and/or char count in the footer of the editor.

![Screenshot]
(http://www.watchersnet.de/Portals/0/screenshots/dnn/CKEditorWordCountPlugin.png)

####Demo

http://w8tcha.github.com/CKEditor-WordCount-Plugin/

DISCLAIMER: This is a forked Version, i can not find the original Author anymore if anyone knows the original Author please contact me and i can include the Author in the Copyright Notices. 

####License

Licensed under the terms of the MIT License.

####Installation

 1. Extract the contents of the file into the "plugins" folder of CKEditor.
 2. In the CKEditor configuration file (config.js) add the following code:

````
config.extraPlugins = 'wordcount';
````


````
config.wordcount = {

    // Whether or not you want to show the Word Count
    showWordCount: true,

    // Whether or not you want to show the Char Count
    showCharCount: false,
    
    // Option to limit the characters in the Editor
    charLimit: 'unlimited',

    // Whether or not to include Html chars in the Char Count
    countHTML: false,

    // Option to limit the words in the Editor
    wordLimit: 'unlimited'
};
````

