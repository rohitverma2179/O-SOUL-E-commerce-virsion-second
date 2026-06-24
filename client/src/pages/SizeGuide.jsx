import React, { useEffect } from 'react';

const sizeCharts = [
  {
    title: "Unisex Plain Tee (in inches)",
    headers: ["Size", "Chest", "Sleeve length", "Body length", "Shoulder width"],
    rows: [
      ["S", "38-40", "8.5", "26", "19.5"],
      ["M", "40-42", "9", "27", "21.5"],
      ["L", "42-43", "9.5", "28", "23"],
      ["XL", "44-45", "10", "29", "24.5"],
      ["XXL", "46-47", "10.5", "29.5", "25"],
    ]
  },
  {
    title: "Men's Pocket Tee (in inches)",
    headers: ["Size", "Chest", "Sleeve length", "Body length", "Shoulder width"],
    rows: [
      ["S", "38-40", "8.5", "26", "19.5"],
      ["M", "40-42", "9", "27", "21.5"],
      ["L", "42-43", "9.5", "28", "23"],
      ["XL", "44-45", "10", "29", "24.5"],
      ["XXL", "46-47", "10.5", "29.5", "25"],
    ]
  },
  {
    title: "Women's Cropped Hoodie (in inches)",
    headers: ["Size", "Chest", "Body length", "Hem width", "Shoulder width"],
    rows: [
      ["S", "27-31", "16.5", "36", "14"],
      ["M", "32-33", "17", "38", "15"],
      ["L", "34-36", "17.5", "40", "16"],
      ["XL", "37-38", "18", "42", "17"],
      ["XXL", "39-42", "18.5", "44", "18"],
    ]
  },
  {
    title: "Women's Harem Pants (in inches)",
    headers: ["Size", "Waist", "Hip", "Inseam", "Outseam", "Front rise", "Back rise"],
    rows: [
      ["S", "24-26", "29", "25.5", "36", "13", "14"],
      ["M", "26-28", "31", "26", "38", "13.5", "14.5"],
      ["L", "28-30", "34", "27", "39", "14", "15"],
      ["XL", "30-33", "35-37", "28", "40", "14.5", "15.5"],
      ["XXL", "34-36", "41", "29", "41", "15", "16"],
    ]
  },
  {
    title: "Men's Joggers (in inches)",
    headers: ["Size", "Waist", "Hip", "Inseam", "Outseam", "Front rise", "Back rise", "Hem width"],
    rows: [
      ["S", "26-28.5", "37", "29.5", "38", "12.5", "14.5", "10"],
      ["M", "29-31.5", "39", "30", "39.5", "13", "15", "11"],
      ["L", "32-33.5", "41", "30.5", "41", "13.5", "15.5", "12"],
      ["XL", "34-36.5", "43", "31.5", "42", "14", "16", "13"],
      ["XXL", "37-39.5", "45", "32", "43", "14.5", "16.5", "14"],
    ]
  },
  {
    title: "Men's Shorts (in inches)",
    headers: ["Size", "Waist", "Hip", "Inseam", "Outseam", "Front rise", "Back rise", "Hem width", "Thigh"],
    rows: [
      ["S", "26-28", "39", "6", "16.5", "13.5", "14.5", "23", "35"],
      ["M", "28-31", "41", "6.5", "17", "14", "15", "23.5", "37"],
      ["L", "31-33", "43", "7", "17.5", "14.5", "15.5", "24", "39"],
      ["XL", "34-36", "45", "7.5", "18.5", "15", "16", "24.5", "41"],
      ["XXL", "37-39", "47-49", "8", "19.5", "15.5", "16.5", "25", "43.5"],
    ]
  }
];

const SizeGuide = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container-osoul max-w-4xl py-14 md:py-24">
        <header className="mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Size Guide</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-tight">Pick your size. <span className="italic text-olive">Not theirs.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground italic leading-relaxed">
            O'Soul is cut for Indian body proportions — not imported templates. If you've been sizing up your whole life, you might not have to here.
          </p>
        </header>

        {/* Size Table */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm mb-20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Size</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">What it feels like</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Choose this if...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[
                { s: "S", feel: "Close everyday fit", if: "You like clothes that sit close without being tight" },
                { s: "M", feel: "Regular comfortable fit", if: "Most people. Most days. This is the standard pick." },
                { s: "L", feel: "More relaxed, easy fit", if: "You like room to move and a looser drape" },
                { s: "XL", feel: "Roomy comfort fit", if: "Maximum ease. Or if your thighs are fuller and you want true comfort" },
                { s: "XXL", feel: "Maximum ease", if: "Wide, relaxed fit all through" }
              ].map((item) => (
                <tr key={item.s} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-5 font-serif text-xl italic text-foreground">{item.s}</td>
                  <td className="px-6 py-5 text-sm font-medium text-foreground/80 italic">{item.feel}</td>
                  <td className="px-6 py-5 text-sm text-muted-foreground italic">{item.if}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Size Charts */}
        <div className="mb-20 space-y-12">
          {sizeCharts.map((chart, idx) => (
            <div key={idx}>
              <h3 className="font-serif text-2xl italic mb-6">{chart.title}</h3>
              <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      {chart.headers.map((header, hIdx) => (
                        <th key={hIdx} className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {chart.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-secondary/10 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={`px-6 py-4 text-sm ${cIdx === 0 ? 'font-serif text-lg italic text-foreground' : 'text-muted-foreground'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Decision Guide */}
        <div className="grid gap-12 md:grid-cols-2 mb-20">
          <div>
            <h3 className="font-serif text-2xl italic mb-6">Size Decision Guide</h3>
            <ul className="space-y-6 text-sm text-muted-foreground italic leading-relaxed">
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>If you hate feeling clothes on your body <span className="text-foreground">→ size up one.</span></span>
              </li>
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>If you like clothes that know they're there but don't fight you <span className="text-foreground">→ your usual size.</span></span>
              </li>
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>If your thighs are wider than your waist would suggest <span className="text-foreground">→ try L before XL.</span> The thigh room is already built in.</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-2xl italic mb-6 invisible md:visible">_</h3>
            <ul className="space-y-6 text-sm text-muted-foreground italic leading-relaxed">
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>If you're between sizes <span className="text-foreground">→ size up.</span> The fit is relaxed by design.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>For boxy tees <span className="text-foreground">→ your usual size</span> gives the intended boxy fall. Sizing up makes it oversized.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-olive font-bold">·</span>
                <span>For shorts <span className="text-foreground">→ if fuller thighs, size up.</span> The waist will still sit well.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer DM CTA */}
        <div className="rounded-2xl bg-foreground p-10 md:p-14 text-center text-background">
          <p className="font-serif text-2xl md:text-3xl italic leading-tight">
            Still not sure? DM us your height and waist. <br className="hidden md:block" />
            We'll tell you exactly which size to pick.
          </p>
          <div className="mt-8">
            <a 
              href="https://instagram.com/osoul.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center rounded-md bg-background px-10 text-[11px] font-bold uppercase tracking-widest text-foreground hover:bg-background/90 transition-all"
            >
              DM on Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
