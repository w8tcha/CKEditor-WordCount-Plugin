import React from 'react';
import { CKEditor } from 'ckeditor4-react';

/**
 * `initData` can be either string with markup or JSX:
 *
 * <CKEditor initData="<p>Hello <strong>world</strong>!</p>" />
 *
 * Or:
 *
 * <CKEditor initData={<p>Hello <strong>world</strong>!</p>} />
 *
 */
function App() {
	return (
		<div>
			<section>
				<CKEditor
					debug={true}
					 onBeforeLoad={ CKEDITOR => {
            CKEDITOR.plugins.addExternal( 'wordcount', '/node_modules/ckeditor-wordcount-plugin/wordcount/', 'plugin.js' );
        }
    }
					config={{
					toolbar: [
						[ 'Source' ],
						[ 'Styles', 'Format', 'Font', 'FontSize' ],
						[ 'Bold', 'Italic' ],
						[ 'Undo', 'Redo' ],
						[ 'EasyImageUpload' ],
						[ 'About' ]
					],
					extraPlugins: 'wordcount'
				}}
					initData="<p>Hello <strong>world</strong>!</p>"
				/>
			</section>
			<footer>{`Running React v${ React.version }`}</footer>
		</div>
	);
}

export default App;
