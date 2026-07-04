import { STATUS_LABEL } from "@/lib/utils";

const CLASS_MAP: Record<string, string> = {
  PENDING: "stempel-pending",
  APPROVED: "stempel-approved",
  REJECTED: "stempel-rejected",
  PAID: "stempel-paid",
};

export default function StatusStempel({ status }: { status: string }) {
  return <span className={`stempel ${CLASS_MAP[status] ?? ""}`}>{STATUS_LABEL[status] ?? status}</span>;
}
