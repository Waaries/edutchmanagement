
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface FilterOptions {
  status: string;
  addressType: string;
  businessType: string;
  dateRange: string;
  searchTerm: string;
}

interface SearchAndFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalCount: number;
  filteredCount: number;
}

const SearchAndFilters = ({ filters, onFiltersChange, totalCount, filteredCount }: SearchAndFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'all',
      addressType: 'all',
      businessType: 'all',
      dateRange: 'all',
      searchTerm: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== 'all' && value !== '').length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Zoeken en Filteren</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Zoek op bedrijfsnaam, contactpersoon, email..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="pl-10"
            />
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <select
                  id="status-filter"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="all">Alle statussen</option>
                  <option value="pending">In behandeling</option>
                  <option value="processing">Wordt verwerkt</option>
                  <option value="approved">Goedgekeurd</option>
                  <option value="rejected">Afgewezen</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address-type-filter">Adrespakket</Label>
                <select
                  id="address-type-filter"
                  value={filters.addressType}
                  onChange={(e) => handleFilterChange('addressType', e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="all">Alle pakketten</option>
                  <option value="basic">Basis Pakket</option>
                  <option value="premium">Premium Pakket</option>
                  <option value="complete">Complete Pakket</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-type-filter">Bedrijfstype</Label>
                <select
                  id="business-type-filter"
                  value={filters.businessType}
                  onChange={(e) => handleFilterChange('businessType', e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="all">Alle types</option>
                  <option value="retail">Detailhandel</option>
                  <option value="services">Dienstverlening</option>
                  <option value="manufacturing">Productie</option>
                  <option value="tech">Technologie</option>
                  <option value="healthcare">Zorgverlening</option>
                  <option value="consulting">Consultancy</option>
                  <option value="other">Anders</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-range-filter">Periode</Label>
                <select
                  id="date-range-filter"
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="all">Alle periodes</option>
                  <option value="today">Vandaag</option>
                  <option value="week">Afgelopen week</option>
                  <option value="month">Afgelopen maand</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              {filteredCount} van {totalCount} aanvragen
              {activeFiltersCount > 0 && " (gefilterd)"}
            </span>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Wis filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchAndFilters;
