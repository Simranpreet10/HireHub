import Input from "../ui/Input";

export default function JobFilters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Input
        placeholder="Search by title"
        value={filters.title}
        onChange={(e) => setFilters({ ...filters, title: e.target.value })}
      />
      <Input
        placeholder="Location"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      />
      <Input
        placeholder="Company"
        value={filters.company}
        onChange={(e) => setFilters({ ...filters, company: e.target.value })}
      />
    </div>
  );
}
