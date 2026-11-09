import { Modal as AntModal } from "antd";

/** Simple accessible modal used by the admin forms. */
export function Modal({ open, title, description, onClose, children, wide = false }) {
  return (
    <AntModal
      open={open}
      title={title}
      onCancel={onClose}
      footer={null}
      width={wide ? 860 : 560}
      centered
      destroyOnHidden
      styles={{
        content: { padding: 0, overflow: "hidden" },
        header: { padding: "20px 24px", margin: 0, borderBottom: "1px solid #E7E8F0" },
        body: { padding: "20px 24px", maxHeight: "70vh", overflowY: "auto" },
      }}
    >
      {description ? <p className="mb-4 text-sm text-[#777A91]">{description}</p> : null}
      {children}
    </AntModal>
  );
}
