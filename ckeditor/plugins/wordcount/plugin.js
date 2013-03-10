/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */
 
CKEDITOR.plugins.add('wordcount', {
    lang: ['de', 'en'],
    init: function (editor) {
        
        var defaultLimit = 'unlimited';
        var defaultFormat = '<span class="cke_path_item">';
        var limit = defaultLimit;
        
        var intervalId;
        var lastWordCount = 0;
        var lastCharCount = 0;
        var limitReachedNotified = false;
        var limitRestoredNotified = false;
        
        // Default Config
        var defaultConfig = {
            showWordCount: true,
            showCharCount: false
        };
        
        // Get Config & Lang
        var config = CKEDITOR.tools.extend(defaultConfig, editor.config.wordcount || {}, true);
        
        if (config.showCharCount) {
            defaultFormat += editor.lang.wordcount.CharCount + '&nbsp;%charCount%';
        }

        if (config.showCharCount && config.showWordCount) {
            defaultFormat += ',&nbsp;';
        }

        if (config.showWordCount) {
            defaultFormat += editor.lang.wordcount.WordCount + ' %wordCount%';
        }
        
        defaultFormat += '</span>';
        
        var format = defaultFormat;

        CKEDITOR.document.appendStyleSheet(this.path + 'css/wordcount.css');

        function counterId(editor) {
            return 'cke_wordcount_' + editor.name;
        }

        function counterElement(editor) {
            return document.getElementById(counterId(editor));
        }

        function strip(html) {
            var tmp = document.createElement("div");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText;
        }

        function updateCounter(editor) {
            var wordCount = 0;
            var charCount = 0;

            if (editor.getData()) {

                if (config.showWordCount) {
                    wordCount = strip(editor.getData()).trim().split(/\s+/).length;
                }

                if (config.showCharCount) {
                    charCount = strip(editor.getData()).trim().length;
                }
            }
            var html = format.replace('%wordCount%', wordCount).replace('%charCount%', charCount);

            counterElement(editor).innerHTML = html;

            if (charCount == lastCharCount) {
                return true;
            } else {
                lastWordCount = wordCount;
                lastCharCount = charCount;
            }
            if (wordCount > limit) {
                limitReached(editor, limitReachedNotified);
            } else if (!limitRestoredNotified && wordCount < limit) {
                limitRestored(editor);
            }
            return true;
        }

        function limitReached(editor, notify) {
            limitReachedNotified = true;
            limitRestoredNotified = false;
            editor.execCommand('undo');
            if (!notify) {
                editor.fire('limitReached', {}, editor);
            }
            // lock editor
            editor.config.Locked = 1;
            editor.fire("change");
        }

        function limitRestored(editor) {
            limitRestoredNotified = true;
            limitReachedNotified = false;
            editor.config.Locked = 0;
        }

        editor.on('uiSpace', function(event) {
            if (event.data.space == 'bottom') {
                event.data.html += '<div id="' + counterId(event.editor) + '" class="cke_wordcount" style=""' + ' title="' + CKEDITOR.tools.htmlEncode('Words Counter') + '"' + '>&nbsp;</div>';
            }
        }, editor, null, 100);
        editor.on('instanceReady', function() {
            if (editor.config.wordcount_limit != undefined) {
                limit = editor.config.wordcount_limit;
            }
            if (editor.config.wordcount_format != undefined) {
                format = editor.config.wordcount_format;
            }
        }, editor, null, 100);
        editor.on('dataReady', function(event) {
            var count = event.editor.getData().length;
            if (count > limit) {
                limitReached(editor);
            }
            updateCounter(event.editor);
        }, editor, null, 100);
        editor.on('change', function (event) {
            updateCounter(event.editor);
        }, editor, null, 100);
        editor.on('focus', function(event) {
            editorHasFocus = true;
            intervalId = window.setInterval(function(editor) {
                updateCounter(editor);
            }, 100, event.editor);
        }, editor, null, 100);
        editor.on('blur', function() {
            editorHasFocus = false;
            if (intervalId) clearInterval(intervalId);
        }, editor, null, 100);
    }
});
