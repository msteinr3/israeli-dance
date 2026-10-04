import Link from "next/link";
import { commonStyles } from "@/styles/common";
import PlaceSearch from "@/components/PlaceSearch";
import { markidim } from "@/data/markidim";
import { places } from "@/data/places";

export default function PlacesPage() {
  return (
    <main style={commonStyles.page}>
      <div style={commonStyles.container}>
        <div style={commonStyles.pageHeader}>
          <h1 style={styles.title}>Places to Dance</h1>

          <Link href="/submit?type=place" style={commonStyles.button}>
            Add New
          </Link>
        </div>
        <PlaceSearch places={places} markidim={markidim} />{" "}
      </div>
    </main>
  );
}

const styles = {};
