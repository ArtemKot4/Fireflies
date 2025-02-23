class Keyboard {
    public context: any = UI.getContext();
    public func: (text: string) => void;
    public default_string: string;
    constructor(default_string: string){
        this.default_string = default_string;
    }
    public getText(func: (text: string) => void): Keyboard {
        this.func = func;
        return this;
    }
    public open(): void {
        let self = this;
        this.context.runOnUiThread({
            run() {
                let editText = new android.widget.EditText(self.context);
                editText.setHint(self.default_string);
                let builder: any = new android.app.AlertDialog.Builder(self.context);
                
                builder.setView(editText)
                    .setPositiveButton("ok", {
                        onClick(){
                            let text = String(editText.getText());
                            self.func(text)
                        }
                    }).show();
            }
        });
    }
};