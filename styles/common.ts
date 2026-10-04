import { colors } from "./colors";

export const commonStyles = {
  page: {
    minHeight: "calc(100vh - 73px)",
    backgroundColor: colors.background,
    color: colors.text,
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "60px 40px",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: colors.white,
    padding: "24px",
    borderRadius: "12px",
    border: `1px solid ${colors.border}`,
  },
  button: {
    display: "inline-block",
    padding: "12px 20px",
    backgroundColor: colors.text,
    color: colors.white,
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
  },
  nav: {
    padding: "20px 40px",
    borderBottom: `1px solid ${colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
  },
  links: {
    display: "flex",
    gap: "24px",
  },
  link: {
    color: colors.text,
    textDecoration: "none",
  },
  connectedList: {
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  connectedListItem: {
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
  },
  connectedListSummary: {
    padding: "18px 16px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "18px",
    listStyle: "none",
    backgroundColor: colors.white,
  },
  connectedListDetails: {
    padding: "8px 16px 20px",
    borderTop: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    color: colors.text,
  },
};
