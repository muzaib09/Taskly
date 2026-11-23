import { Trash2 } from "lucide-react";

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  isLoading = false,
  onCancel,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="taskly-confirm-backdrop">
      <section
        className="taskly-confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="taskly-confirm-title"
        aria-describedby="taskly-confirm-message"
      >
        <div className="taskly-confirm-icon">
          <Trash2 size={22} />
        </div>

        <h2 id="taskly-confirm-title">{title}</h2>
        <p id="taskly-confirm-message">{message}</p>

        <div className="taskly-confirm-actions">
          <button
            type="button"
            className="taskly-confirm-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="taskly-confirm-delete"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmDialog;
