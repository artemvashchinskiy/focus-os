import "./AboutPanel/AboutPanel.scss";

interface DropboxHelpPanelProps {
    open: boolean;
    onClose: () => void;
}

export default function DropboxHelpPanel({ open, onClose }: DropboxHelpPanelProps) {
    if (!open) return null;

    return (
        <section className="about-panel open" role="dialog" aria-modal="true" aria-labelledby="dropbox-help-title">
            <div className="about-header">
                <div>
                    <h3 id="dropbox-help-title">How to use Dropbox</h3>
                    <span>Optional cloud backup for Focus OS</span>
                </div>
                <button onClick={onClose} aria-label="Close Dropbox help">✕</button>
            </div>

            <div className="about-content">
                <section className="about-block">
                    <h4>1. Create or sign in to your Dropbox account</h4>
                    <p>
                        Open <a href="https://www.dropbox.com/register" target="_blank" rel="noreferrer">Dropbox registration</a> to create an account, or use <a href="https://www.dropbox.com/login" target="_blank" rel="noreferrer">Dropbox sign in</a> if you already have one. You do not need to give Focus OS your Dropbox password.
                    </p>
                </section>

                <section className="about-block">
                    <h4>2. Connect Dropbox in Focus OS</h4>
                    <p>
                        Return to Navigation → Cloud and click <strong>Dropbox</strong>. Dropbox opens its own authorization page. Check the requested access and approve it only if you want to connect your account.
                    </p>
                </section>

                <section className="about-block">
                    <h4>3. Choose when data is transferred</h4>
                    <p>
                        Your organizer is designed to work locally in your browser. Connecting an account does not mean Focus OS continuously uploads your notes. Use <strong>Backup</strong> when you want to send a backup to Dropbox, and <strong>Restore</strong> when you want to retrieve one.
                    </p>
                </section>

                <section className="about-block">
                    <h4>Does Focus OS steal or read my Dropbox password?</h4>
                    <p>
                        Focus OS does not ask for or need your Dropbox password. Sign-in and permission approval happen on Dropbox's website. When you run a backup, the selected app data is sent to your Dropbox account through the authorized connection. As with any cloud backup, review the permissions and only connect on a device and account you trust.
                    </p>
                </section>

                <section className="about-block">
                    <h4>How can I disconnect it?</h4>
                    <p>
                        You can revoke Focus OS access from your Dropbox account's <a href="https://www.dropbox.com/account/connected_apps" target="_blank" rel="noreferrer">Connected apps settings</a>. Revoking access prevents future cloud operations; it does not necessarily delete backups already stored in Dropbox, so remove those separately if you no longer want them.
                    </p>
                </section>

                <div className="about-joke">
                    Your data, your account, your choice. Keep a local export too if the information is important.
                </div>
            </div>
        </section>
    );
}
