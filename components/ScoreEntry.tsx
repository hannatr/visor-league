"use client";

import { useState } from "react";
import type { Hole } from "@/types/domain";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ScoreEntryProps = {
  show: boolean;
  onClose: () => void;
  hole: Hole | null;
  score: number;
  onSave: (score: number) => void;
};

export default function ScoreEntry({
  show,
  onClose,
  hole,
  score,
  onSave,
}: ScoreEntryProps) {
  const [holeScore, setHoleScore] = useState(score);

  if (!hole) {
    return null;
  }

  const handleSave = () => {
    onSave(holeScore);
    onClose();
  };

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hole {hole.holeNumber}</DialogTitle>
          <DialogDescription>Par: {hole.par}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hole-score">Score</Label>
          <Input
            id="hole-score"
            type="number"
            value={holeScore}
            onChange={(e) => setHoleScore(parseInt(e.target.value, 10) || 0)}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
