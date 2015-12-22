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
 2. http://ckeditor.com/addon/notification - download the Notification Plugin and all its dependencies.
 3. In the CKEditor configuration file (config.js) add the following code:

````js
config.extraPlugins = 'wordcount,notification';
````
 4. You can add the following config. if you need other than the default settings

````js
config.wordcount = {

    // Whether or not you want to show the Paragraphs Count, Default Value: true
    showParagraphs: true,

    // Whether or not you want to show the Word Count, Default Value: true
    showWordCount: true,

    // Whether or not you want to show the Char Count, Default Value: false
    showCharCount: false,

    // Whether or not you want to count Spaces as Chars, Default Value: false
    countSpacesAsChars: false,

    // Whether or not to include Html chars in the Char Count, Default Value: false
    countHTML: false,
    
    // Maximum allowed Word Count that can be entered in the editor, Default Value: -1 (unlimited)
    maxWordCount: 10,

    // Maximum allowed Chararcater Count entered be in the editor, Default Value: -1 (unlimited)
    maxCharCount: 12,

    // Add filter to add or remove element before counting (see CKEDITOR.htmlParser.filter), Default value : null (no filter)
    filter: new CKEDITOR.htmlParser.filter({
        elements: {
            div: function( element ) {
                if(element.attributes.class == 'mediaembed') {
                    return false;
                }
            }
        }
    })
};
````

