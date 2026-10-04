import Link from "next/link";
import { usefulLinks } from "@/data/usefulLinks";
import { colors } from "@/styles/colors";
import { commonStyles } from "@/styles/common";
import Image from "next/image";

export default function Home() {
  return (
    <main style={commonStyles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.heroText}>
            <p style={styles.eyebrow}>Israeli Dance</p>

            <h1 style={styles.title}>Explore Israeli dancing.</h1>

            <p style={styles.subtitle}>
              Discover dances, songs, events, and places to dance.
            </p>

            <Link href="/about" style={commonStyles.button}>
              Learn more
            </Link>
          </div>

          <div style={styles.heroImageContainer}>
            <Image
              src="/images/dancing.jpg"
              alt="Israeli folk dancing"
              width={1200}
              height={800}
              style={styles.heroImage}
            />
          </div>
        </section>

        <section style={styles.linksSection}>
          <h2>Useful Links</h2>

          <div style={styles.linksList}>
            {usefulLinks.map((link, index) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.linkItem,
                  borderBottom:
                    index === usefulLinks.length - 1
                      ? "none"
                      : `1px solid ${colors.border}`,
                }}
              >
                <div>
                  <strong>{link.name}</strong>
                  <p style={styles.linkDescription}>{link.description}</p>
                </div>

                <span>→</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "60px 40px",
  },
  hero: {
    display: "flex",
    alignItems: "center",
    gap: "60px",
    padding: "60px 0 80px",
  },
  heroText: {
    flex: 1,
  },
  heroImageContainer: {
    flex: 1,
  },
  heroImage: {
    width: "100%",
    height: "auto",
    borderRadius: "12px",
    display: "block",
  },
  eyebrow: {
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "52px",
    lineHeight: "1.1",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "20px",
    color: colors.mutedText,
    maxWidth: "600px",
    marginBottom: "32px",
  },
  linksSection: {
    marginTop: "40px",
  },
  linksList: {
    marginTop: "20px",
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  linkItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 20px",
    textDecoration: "none",
    color: colors.text,
  },
  linkDescription: {
    margin: "6px 0 0",
    color: colors.mutedText,
  },
};
