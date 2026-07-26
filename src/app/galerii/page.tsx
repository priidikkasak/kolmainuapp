import type { Metadata } from "next";
import Image from "next/image";
import { PageTitle } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Galerii",
};

type Photo = {
  src: string;
  alt: string;
  caption: string;
  wide?: boolean;
  priority?: boolean;
};

type Group = {
  title: string;
  photos: Photo[];
};

const groups: Group[] = [
  {
    title: "Kirik ja hoone",
    photos: [
      {
        src: "/images/meist.jpg",
        alt: "Kolmainu kirik loojangul",
        caption: "Kolmainu kirik loojangul",
        wide: true,
        priority: true,
      },
      {
        src: "/images/gal-interior.jpg",
        alt: "Kirikusaal",
        caption: "Kirikusaal",
        priority: true,
      },
      {
        src: "/images/gal-altar.jpg",
        alt: "Altar",
        caption: "Altar armulauaga",
        priority: true,
      },
      {
        src: "/images/gal-talv.jpg",
        alt: "Kirik talvel",
        caption: "Talveõhtul",
      },
      {
        src: "/images/galerii.jpg",
        alt: "Vitraaž",
        caption: "Vitraaž",
      },
    ],
  },
  {
    title: "Muusika ja teenistused",
    photos: [
      {
        src: "/images/gal-koor.jpg",
        alt: "Kammerkoor",
        caption: "Kammerkoor proovis",
      },
      {
        src: "/images/muusika.jpg",
        alt: "Orel",
        caption: "Sauer'i orel",
      },
      {
        src: "/images/talitused.jpg",
        alt: "Küünal altarilt",
        caption: "Küünal armulauas",
      },
      {
        src: "/images/jutlused.jpg",
        alt: "Kantsel",
        caption: "Kantsel ja Piibel",
      },
    ],
  },
  {
    title: "Koguduse elu",
    photos: [
      {
        src: "/images/gal-piibel.jpg",
        alt: "Piibli lugemine",
        caption: "Piibli lugemine",
      },
      {
        src: "/images/kogukond.jpg",
        alt: "Koos kohvilaual",
        caption: "Koos kohvilaual",
      },
      {
        src: "/images/gal-suvi.jpg",
        alt: "Suvine leerilaager",
        caption: "Suvine leerilaager",
        wide: true,
      },
    ],
  },
];

function GalleryItem({ photo }: { photo: Photo }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[14px] bg-surface ${
        photo.wide ? "col-span-2 aspect-[16/9]" : "aspect-square"
      }`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={photo.wide ? "(max-width: 520px) 100vw, 520px" : "(max-width: 520px) 50vw, 260px"}
        className="object-cover"
        priority={photo.priority}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        className="absolute left-3 right-3 bottom-2.5 z-[2] text-[12px] font-medium text-white tracking-[-0.005em]"
        style={{ textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
      >
        {photo.caption}
      </div>
    </div>
  );
}

export default function GaleriiPage() {
  return (
    <>
      <PageTitle
        title="Galerii"
        subtitle="Hetked koguduse elust ja kirikust."
      />

      {groups.map((group) => (
        <div key={group.title} className="mt-6">
          <div className="mb-3 pl-1 text-[17px] font-semibold text-ink tracking-[-0.02em]">
            {group.title}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {group.photos.map((photo) => (
              <GalleryItem key={photo.src + photo.caption} photo={photo} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
