"use client";

/**
 * ExhibitionsScreen — the GALLERY home: hero TopBar ("GALLERY" over the
 * "WEIMAR — DESSAU — BERLIN" overline), a numbered exhibition list
 * (01/02/03 in huge display type beside mini posters), a triad colour-study
 * strip, and a pushed exhibition DETAIL view: big poster header, curatorial
 * blurb, hard facts row, hung works grid (ArtTile → plate view), TICKETS.
 */

import type { CSSProperties } from "react";
import { TopBar } from "../../../proto-kit";
import { ArtTile } from "../components/art-tile";
import { DiagonalDivider, IconButton, SectionLabel, TriadRule } from "../components/bits";
import { GeometricPoster } from "../components/geometric-poster";
import { ARTWORK_BY_ID, EXHIBITIONS, TRIAD_STUDY } from "../lib/data";
import { useGallery } from "../state/gallery-context";
import styles from "./exhibitions-screen.module.css";

function BackGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
      <path d="M10 2 4 8l6 6" />
    </svg>
  );
}

export function ExhibitionsScreen() {
  const { detailId, openDetail, closeDetail, showToast } = useGallery();

  const exhibition = detailId != null ? EXHIBITIONS.find((e) => e.id === detailId) : null;

  if (exhibition) {
    const works = exhibition.artworkIds.map((id) => ARTWORK_BY_ID[id]).filter(Boolean);
    return (
      <div className={styles.root} key={`detail-${exhibition.id}`}>
        <TopBar
          variant="hero"
          title={exhibition.title}
          subtitle={`Ausstellung ${exhibition.num}`}
        />

        <div className={styles.content}>
          <div className={styles.backRow}>
            <IconButton label="Back to exhibitions" onClick={closeDetail}>
              <BackGlyph />
            </IconButton>
            <button type="button" className={styles.backText} onClick={closeDetail}>
              Alle Ausstellungen
            </button>
          </div>

          <div className={styles.detailPoster}>
            <GeometricPoster poster={exhibition.poster} />
          </div>

          <div className={styles.factsRow}>
            <span className={styles.fact}>{exhibition.dates}</span>
            <span className={styles.factDivider} aria-hidden="true" />
            <span className={styles.fact}>{exhibition.location}</span>
            <span className={styles.factDivider} aria-hidden="true" />
            <span className={styles.factPrice}>EUR {exhibition.price}</span>
          </div>

          <p className={styles.blurb}>{exhibition.blurb}</p>

          <div className={styles.triadStrip} aria-hidden="true">
            {TRIAD_STUDY.map((t) => (
              <span
                key={t.id}
                className={styles.triadBlock}
                style={{ background: `var(${t.token})` }}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.ticketsBtn}
            onClick={() => showToast(`TICKETS — ${exhibition.title.toUpperCase()} · EUR ${exhibition.price}`, "red")}
          >
            TICKETS — EUR {exhibition.price}
          </button>

          <DiagonalDivider />

          <SectionLabel trailing={`${works.length} WERKE`}>In dieser Ausstellung</SectionLabel>
          <div className={styles.grid}>
            {works.map((a, i) => (
              <ArtTile key={a.id} art={a} index={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <TopBar variant="hero" title="Gallery" subtitle="Weimar — Dessau — Berlin" />

      <div className={styles.content}>
        <SectionLabel trailing="3 AKTUELL">Ausstellungen</SectionLabel>

        <div className={styles.list}>
          {EXHIBITIONS.map((ex, i) => (
            <button
              key={ex.id}
              type="button"
              className={styles.row}
              style={{ ["--stagger" as string]: `${i * 60}ms` } as CSSProperties}
              onClick={() => openDetail(ex.id)}
            >
              <span className={styles.num}>{ex.num}</span>
              <span className={styles.rowPoster}>
                <GeometricPoster poster={ex.poster} />
              </span>
              <span className={styles.rowBody}>
                <span className={styles.rowTitle}>{ex.title}</span>
                <span className={styles.rowDates}>{ex.dates}</span>
                <span className={styles.rowPrice}>EUR {ex.price}</span>
              </span>
              <span className={styles.rowArrow} aria-hidden="true" />
            </button>
          ))}
        </div>

        <DiagonalDivider />

        <SectionLabel>Farbstudie</SectionLabel>
        <div className={styles.study} aria-label="Colour study — the triad">
          {TRIAD_STUDY.map((t) => (
            <div key={t.id} className={styles.studyCell}>
              <span className={styles.studyBlock} style={{ background: `var(${t.token})` }} />
              <span className={styles.studyLabel}>{t.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.listFooter}>
          <TriadRule />
          <p className={styles.footerNote}>
            Alles hängt im Rahmen: 2px Tinte, keine Schatten. Form folgt Farbe.
          </p>
        </div>
      </div>
    </div>
  );
}
