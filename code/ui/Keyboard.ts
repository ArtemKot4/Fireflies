/**
 * Class to create android clickable field, which with click opens keyboard and inputs text.
 */
class Keyboard {
    public context: any = UI.getContext();
    public func: (text: string) => void;
    
    constructor(public placeholderText: string) {}

    public getText(func: (text: string) => void): Keyboard {
        this.func = func;
        return this;
    }

    public open(): void {
        const self = this;
        this.context.runOnUiThread({
            run() {
                let editText = new android.widget.EditText(self.context);
                editText.setHint(self.placeholderText);
                let builder: any = new android.app.AlertDialog.Builder(self.context);
                
                builder.setView(editText).setPositiveButton("ok", {
                    onClick() {
                        let text = String(editText.getText());
                        self.func(text)
                    }
                }).show();
            }
        });
    }
}