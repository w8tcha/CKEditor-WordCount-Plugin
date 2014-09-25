/**
 * @license Copyright (c) CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.plugins.add('wordcount', {
    lang: 'ca,de,el,en,es,fr,hr,it,jp,nl,no,pl,pt-br,ru,sv', // %REMOVE_LINE_CORE%
    version: 1.10,
    init: function(editor) {
        var defaultFormat = '',
            intervalId,
            lastWordCount,
            lastCharCount = 0;
            limitReachedNotified = false,
            limitRestoredNotified = false;

        // Default Config
        var defaultConfig = {
            showWordCount: true,
            showCharCount: false,
            countSpacesAsChars: false,
            charLimit: 'unlimited',
            wordLimit: 'unlimited',
            countHTML: false
        };

        // Get Config & Lang
        var config = CKEDITOR.tools.extend(defaultConfig, editor.config.wordcount || {}, true);

        if (config.showCharCount) {
            var charLabel = editor.lang.wordcount[config.countHTML ? 'CharCountWithHTML' : 'CharCount'];

            defaultFormat += charLabel + ' %charCount%';

            if (config.charLimit != 'unlimited') {
                defaultFormat += ' (' + editor.lang.wordcount.limit + ' ' + config.charLimit + ')';
            }
        }

        if (config.showCharCount && config.showWordCount) {
            defaultFormat += ', ';
        }

        if (config.showWordCount) {
            defaultFormat += editor.lang.wordcount.WordCount + ' %wordCount%';

            if (config.wordLimit != 'unlimited') {
                defaultFormat += ' (' + editor.lang.wordcount.limit + ' ' + config.wordLimit + ')';
            }
        }

        //defaultFormat += '</span>';

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
                return '';
            }

            return tmp.textContent || tmp.innerText;
        }

        function strip_tags(html) {
          var tmp = document.createElement('DIV');
          tmp.innerHTML = html;

          return (tmp.textContent || tmp.innerText || '').trim();
        }

        function normalize_text(input) {
          input = strip_tags(input);
          input = input
                  .replace(/[\r\n]+/g, "")
                  .replace(/^\s+|\s+$/g, "")
                  .replace("&nbsp;", " ")

          return input;
        }

        function updateCounter(editorInstance) {
            var wordCount = 0,
                charCount = 0,
                normalizedText,
                text;

            if (text = editorInstance.getData()) {
                if (config.showCharCount) {
                  normalizedText = normalize_text(text);
                  console.log(normalizedText);
                  charCount = normalizedText.length;
                }

                if (config.showWordCount) {
                    normalizedText = normalize_text(text);

                    var words = normalizedText.split(/\s+/);

                    for (var wordIndex = words.length - 1; wordIndex >= 0; wordIndex--) {
                        if (words[wordIndex].match(/^([\s\t\r\n]*)$/)) {
                            words.splice(wordIndex, 1);
                        }
                    }

                    wordCount = words.length;
                }

                var html = format.replace('%wordCount%', wordCount).replace('%charCount%', charCount);

                editorInstance.plugins.wordcount.wordCount = wordCount;
                editorInstance.plugins.wordcount.charCount = charCount;

                if (CKEDITOR.env.gecko) {
                    counterElement(editorInstance).innerHTML = html;
                } else {
                    counterElement(editorInstance).innerText = html;
                }

                if (charCount == lastCharCount) {
                    return true;
                }

                lastWordCount = wordCount;
                lastCharCount = charCount;

                // Check for word limit
                if (config.showWordCount && wordCount > config.wordLimit) {
                    limitReached(editor, limitReachedNotified);
                } else if (config.showWordCount && wordCount == config.wordLimit) {
                    // create snapshot to make sure only the content after the limit gets deleted
                    editorInstance.fire('saveSnapshot');
                } else if (!limitRestoredNotified && wordCount < config.wordLimit) {
                    limitRestored(editor);
                }

                // Check for char limit
                if (config.showCharCount && charCount > config.charLimit) {
                    limitReached(editor, limitReachedNotified);
                } else if (config.showCharCount && charCount == config.charLimit) {
                    // create snapshot to make sure only the content after the limit gets deleted
                    editorInstance.fire('saveSnapshot');
                } else if (!limitRestoredNotified && charCount < config.charLimit) {
                    limitRestored(editor);
                }
            }

            

            return true;
        }

        function limitReached(editorInstance, notify) {
            limitReachedNotified = true;
            limitRestoredNotified = false;

            editorInstance.execCommand('undo');

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
			
            counterElement(editorInstance).className = "cke_wordcount";
        }

        editor.on('key', function(event) {
            if (editor.mode === 'source') {
                updateCounter(event.editor);
            }
        }, editor, null, 100);

        editor.on('change', function(event) {

            updateCounter(event.editor);
        }, editor, null, 100);

        editor.on('uiSpace', function(event) {
            if (editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE) {
                if (event.data.space == 'top') {
                    event.data.html += '<div class="cke_wordcount" style=""' + ' title="' + editor.lang.wordcount.title + '"' + '><span id="' + counterId(event.editor) + '" class="cke_path_item">&nbsp;</span></div>';
                }
            } else {
                if (event.data.space == 'bottom') {
                    event.data.html += '<div class="cke_wordcount" style=""' + ' title="' + editor.lang.wordcount.title + '"' + '><span id="' + counterId(event.editor) + '" class="cke_path_item">&nbsp;</span></div>';
                }
            }

        }, editor, null, 100);

        editor.on('dataReady', function(event) {
            updateCounter(event.editor);
        }, editor, null, 100);

        editor.on('afterPaste', function(event) {
            updateCounter(event.editor);
        }, editor, null, 100);
        /*editor.on('focus', function (event) {
            editorHasFocus = true;
            intervalId = window.setInterval(function () {
                updateCounter(editor);
            }, 300, event.editor);
        }, editor, null, 300);*/
        editor.on('blur', function() {
            if (intervalId) {
                window.clearInterval(intervalId);
            }
        }, editor, null, 300);

        if (!String.prototype.trim) {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, '');
            };
        }
    }
});
