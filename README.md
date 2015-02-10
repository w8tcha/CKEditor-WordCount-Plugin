CKEditor-WordCount-Plugin
=========================

WordCount Plugin for CKEditor v4 (or above) that counts the words/characters an shows the word count and/or char count in the footer of the editor.

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

````js
config.extraPlugins = 'wordcount';
````


````js
config.wordcount = {

    // Whether or not you want to show the Word Count
    showWordCount: true,

    // Whether or not you want to show the Char Count
    showCharCount: false,

    // Whether or not to include Html chars in the Char Count
    countHTML: false
};
````
In the CKEditor configuration file (config.js) add the following code for MaxLength Works:
````js
 var wordCountMaxlenthConfig = {
                extraPlugins: 'wordcount',
                wordcount: {
                    showWordCount: true, showCharCount: true,
                    maxParagraphs: 3,
                    maxWordCount: 4,
                    maxCharCount: 10,
                    paragraphsCountGreaterThanMaxLengthEvent: function (currentLength, maxLength) {
                             //Overflow Change Event
                    },
                    wordCountGreaterThanMaxLengthEvent: function (currentLength, maxLength) {
                          //Overflow Change Event
                    },
                    charCountGreaterThanMaxLengthEvent: function (currentLength, maxLength) {
                           //Overflow Change Event
                    },
                    charCountLessThanMaxLengthEvent: function (currentLength, maxLength) {
                              //Default Change Event
                    },
                    paragraphsCountLessThanMaxLengthEvent: function (currentLength, maxLength) {
                           //Default Change Event
                    },
                    wordCountLessThanMaxLengthEvent: function (currentLength, maxLength) {
                       //Default Change Event
                    }
                }
````
In the CKEditor configuration file (config.js) add the following code for Culture Works:
````js
 var wordCountMaxlenthConfig = {
                extraPlugins: 'wordcount',
                wordcount: {
                lang:'tr' //ca,de,el,en,es,fr,hr,it,jp,nl,no,pl,pt-br,ru,sv
                }
}
````


