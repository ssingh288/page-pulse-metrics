import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const FlyerCreator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [offer, setOffer] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const isFormValid = title.trim() && description.trim();

  const getWhatsAppShareLink = () => {
    const text = encodeURIComponent(
      `*${title}*\n${description}\n${offer ? `Offer: ${offer}\n` : ""}`
    );
    return `https://wa.me/?text=${text}`;
  };

  return (
    <Card className="max-w-xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Create & Share a Digital Flyer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Flyer Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={60}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={200}
          />
          <Input
            placeholder="Special Offer (optional)"
            value={offer}
            onChange={e => setOffer(e.target.value)}
            maxLength={80}
          />
          <div>
            <label className="block mb-1 font-medium">Flyer Image (optional)</label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview} alt="Flyer Preview" className="mt-2 rounded shadow w-full max-h-48 object-contain" />
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Preview</h3>
            <div className="border rounded p-4 bg-gray-50">
              <h4 className="text-lg font-bold">{title || "[Title]"}</h4>
              <p className="mb-2">{description || "[Description]"}</p>
              {offer && <p className="text-green-700 font-semibold">Offer: {offer}</p>}
              {imagePreview && <img src={imagePreview} alt="Flyer Preview" className="mt-2 rounded shadow w-full max-h-32 object-contain" />}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              asChild
              disabled={!isFormValid}
              variant="default"
            >
              <a href={getWhatsAppShareLink()} target="_blank" rel="noopener noreferrer">
                Share via WhatsApp
              </a>
            </Button>
            <Button disabled variant="outline">
              Share via Hyper-local (Coming Soon)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlyerCreator; 