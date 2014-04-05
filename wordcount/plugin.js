/**
 * @license Copyright (c) CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.plugins.add('wordcount', {
    lang: 'ca,de,en,es,fr,it,jp,nl,no,pl,pt-br,ru', // %REMOVE_LINE_CORE%
    version : 1.10,
    init: function (editor) {
        if (editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE) {
            return;
        }
        
        var defaultFormat = '<span class="cke_path_item">',
            intervalId,
            lastWordCount = -1,
            lastCharCount = -1,
            limitReachedNotified = false,
            limitRestoredNotified = false,
            snapShot = editor.getSnapshot();

        // Default Config
        var defaultConfig = {
            showWordCount: true,
            showCharCount: false,
            charLimit: 'unlimited',
            wordLimit: 'unlimited',
            countHTML: false
        };

        // Get Config & Lang
        var config = CKEDITOR.tools.extend(defaultConfig, editor.config.wordcount || {}, true);

        if (config.showCharCount) {
            var charLabel = editor.lang.wordcount[config.countHTML ? 'CharCountWithHTML' : 'CharCount'];

            defaultFormat += charLabel + '&nbsp;%charCount%';

            if (config.charLimit != 'unlimited') {
                defaultFormat += '&nbsp;(' + editor.lang.wordcount.limit + '&nbsp;' + config.charLimit + ')';
            }
        }

        if (config.showCharCount && config.showWordCount) {
            defaultFormat += ',&nbsp;';
        }

        if (config.showWordCount) {
            defaultFormat += editor.lang.wordcount.WordCount + ' %wordCount%';

            if (config.wordLimit != 'unlimited') {
                defaultFormat += '&nbsp;(' + editor.lang.wordcount.limit + '&nbsp;' + config.wordLimit + ')';
            }
        }
        
        defaultFormat += '</span>';

        var format = defaultFormat;

        CKEDITOR.document.appendStyleSheet(this.path + 'css/wordcount.css');
        
        function counterId(editorInstance) {
            return 'cke_wordcount_' + editorInstance.name;
        }

        function counterElement(editorInstance) {
            return document.getElementById(counterId(editorInstance));
        }

        function strip(html) {
            var tmp = document.createElement("div");
            tmp.innerHTML = html;

            if (tmp.textContent == '' && typeof tmp.innerText == 'undefined') {
                return '0';
            }

            return tmp.textContent || tmp.innerText;
        }

        function countCharacters(text){
            if (config.countHTML) {
                return( text.length );
            } else {
                // strip body tags
                if (editor.config.fullPage) {
                    var i = text.search(new RegExp("<body>", "i"));
                    if (i != -1) {
                        var j = text.search(new RegExp("</body>", "i"));
                        text = text.substring(i + 6, j);
                    }

                }

                var normalizedText = text.
                    replace(/(\r\n|\n|\r)/gm, "").
                    replace(/^\s+|\s+$/g, "").
                    replace("&nbsp;", "").
                    replace(/\s/g, "");

                normalizedText = strip(normalizedText).replace(/^([\s\t\r\n]*)$/, "");

                return( normalizedText.length );
            }
        }

        function countWords(text){
            var normalizedText = text.
                replace(/(\r\n|\n|\r)/gm, " ").
                replace(/^\s+|\s+$/g, "").
                replace("&nbsp;", " ");

            normalizedText = strip(normalizedText);

            var words = normalizedText.split(/\s+/);

            for (var wordIndex = words.length - 1; wordIndex >= 0; wordIndex--) {
                if (words[wordIndex].match(/^([\s\t\r\n]*)$/)) {
                    words.splice(wordIndex, 1);
                }
            }

            return( words.length );
        }

        function updateCounter(editorInstance) {
            var wordCount = 0,
                charCount = 0,
                deltaChar,
                deltaWord,
                text;

            if (text = editorInstance.getData()) {
                if (config.showCharCount) {
                    charCount = countCharacters(text);
                }

                if (config.showWordCount) {
                    wordCount = countWords(text);
                }
            }

            var html = format.replace('%wordCount%', wordCount).replace('%charCount%', charCount);

            editorInstance.plugins.wordcount.wordCount = wordCount;
            editorInstance.plugins.wordcount.charCount = charCount;

            counterElement(editorInstance).innerHTML = html;

            if (charCount == lastCharCount && wordCount == lastWordCount) {
                return true;
            }

            //If the limit is already over, allow the deletion of characters/words. Otherwise,
            //the user would have to delete at one go the number of offending characters
            deltaWord = wordCount - lastWordCount;
            deltaChar = charCount - lastCharCount;

            lastWordCount = wordCount;
            lastCharCount = charCount;

            if(lastWordCount == -1){
                lastWordCount = wordCount;
            }
            if(lastCharCount == -1){
                lastCharCount = charCount;
            }

            // Check for word limit and/or char limit
            if ((config.wordLimit != "unlimited" && wordCount > config.wordLimit && deltaWord > 0) ||
                (config.charLimit != "unlimited" && charCount > config.charLimit && deltaChar > 0)) {
                limitReached(editorInstance, limitReachedNotified);
            } else if (!limitRestoredNotified && 
                        (config.wordLimit == "unlimited" || wordCount < config.wordLimit) &&
                        (config.charLimit == "unlimited" || charCount < config.charLimit) ) {
                limitRestored(editorInstance);
            } else {
                snapShot = editorInstance.getSnapshot();
            }

            return true;
        }

        function limitReached(editorInstance, notify) {
            limitReachedNotified = true;
            limitRestoredNotified = false;

            editorInstance.loadSnapshot(snapShot);

            if (!notify) {
               //counterElement(editorInstance).className = "cke_wordcount cke_wordcountLimitReached";
                
               editorInstance.fire('limitReached', {}, editor);
            }
            
            // lock editor
            editorInstance.config.Locked = 1;
        }

        function limitRestored(editorInstance) {
            
            limitRestoredNotified = true;
            limitReachedNotified = false;
            editorInstance.config.Locked = 0;
            snapShot = editor.getSnapshot();
            
            counterElement(editorInstance).className = "cke_wordcount";
        }

        editor.on('key', function (event) {
            if (editor.mode === 'source') {
                updateCounter(event.editor);
            }
        }, editor, null, 100);
        
        editor.on('change', function (event) {

            updateCounter(event.editor);
        }, editor, null, 100);
        
        editor.on('uiSpace', function (event) {
            if (event.data.space == 'bottom') {
                event.data.html += '<div id="' + counterId(event.editor) + '" class="cke_wordcount" style=""' + ' title="' + editor.lang.wordcount.title + '"' + '>&nbsp;</div>';
            }
        }, editor, null, 100);

        editor.on('dataReady', function (event) {
            updateCounter(event.editor);
        }, editor, null, 100);
        editor.on('afterPaste', function (event) {
            updateCounter(event.editor);
        }, editor, null, 100);
        /*editor.on('focus', function (event) {
            editorHasFocus = true;
            intervalId = window.setInterval(function () {
                updateCounter(editor);
            }, 300, event.editor);
        }, editor, null, 300);*/
        editor.on('blur', function () {
            if (intervalId) {
                window.clearInterval(intervalId);
            }
        }, editor, null, 300);
        
        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g, '');
            };
        }
    }
});
