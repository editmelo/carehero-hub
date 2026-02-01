import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface ReferralFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  locFilter: string;
  onLocChange: (value: string) => void;
  agencyFilter: string;
  onAgencyChange: (value: string) => void;
}

const locOptions = [
  { value: 'all', label: 'All LOC Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'denied', label: 'Denied' },
];

const agencyOptions = [
  { value: 'all', label: 'All Agencies' },
  { value: 'CICOA', label: 'CICOA' },
  { value: 'LifeStream', label: 'LifeStream' },
  { value: 'REAL Services', label: 'REAL Services' },
  { value: 'Other', label: 'Other' },
];

export function ReferralFilters({
  searchQuery,
  onSearchChange,
  locFilter,
  onLocChange,
  agencyFilter,
  onAgencyChange,
}: ReferralFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client name, county, or confirmation..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={locFilter} onValueChange={onLocChange}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="LOC Status" />
            </SelectTrigger>
            <SelectContent>
              {locOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={agencyFilter} onValueChange={onAgencyChange}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Agency" />
            </SelectTrigger>
            <SelectContent>
              {agencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
